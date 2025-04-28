import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import './Members.css';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null); // State to store the member being edited
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/members');
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await api.post('http://localhost:8080/api/members', values);
            fetchMembers();
            resetForm();
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`http://localhost:8080/api/members/${id}`);
            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const openEditModal = (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedMember(null);
        setIsModalOpen(false);
    };

    const handleEditSubmit = async (values) => {
        try {
            await api.put(`http://localhost:8080/api/members/${selectedMember.memberId}`, values);
            fetchMembers(); // Refresh the member list
            closeEditModal(); // Close the modal
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    return (
        <div className="members">
            <h1>Members Management</h1>

            {/* Add Member Module */}
            <div className="add-member-module">
                <h2>Add a New Member</h2>
                <Formik
                    initialValues={{ name: '', email: '', phoneNumber: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field type="text" id="name" name="name" />
                            <ErrorMessage name="name" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field type="email" id="email" name="email" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <Field type="text" id="phoneNumber" name="phoneNumber" />
                            <ErrorMessage name="phoneNumber" component="div" className="error" />
                        </div>
                        <button type="submit">Add Member</button>
                    </Form>
                </Formik>
            </div>

            {/* Member List Module */}
            <div className="member-list-module">
                <h2>Member List</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map((member) => (
                        <tr key={member.memberId}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.phoneNumber}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => openEditModal(member)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(member.memberId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Member Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Member</h2>
                        <Formik
                            initialValues={{
                                name: selectedMember.name,
                                email: selectedMember.email,
                                phoneNumber: selectedMember.phoneNumber,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleEditSubmit}
                        >
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <Field type="text" id="name" name="name" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Field type="email" id="email" name="email" />
                                    <ErrorMessage name="email" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Field type="text" id="phoneNumber" name="phoneNumber" />
                                    <ErrorMessage name="phoneNumber" component="div" className="error" />
                                </div>
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={closeEditModal}>
                                    Cancel
                                </button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
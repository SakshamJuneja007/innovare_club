"use client";

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

interface Collaborator {
  id: string;
  name: string;
  role: string;
}

interface CollaboratorSelectProps {
  onSelect: (collaborators: Collaborator[]) => void;
  currentCollaborators: Collaborator[];
}

const roleOptions = [
  { value: 'lead', label: 'Project Lead' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'researcher', label: 'Researcher' }
];

const mockUsers = [
  { value: 'user1', label: 'Neural_Dev_01' },
  { value: 'user2', label: 'CyberArchitect' },
  { value: 'user3', label: 'QuantumCoder' },
  { value: 'user4', label: 'SynthWave_Dev' },
  { value: 'user5', label: 'NeonBuilder' }
];

export default function CollaboratorSelect({ onSelect, currentCollaborators }: CollaboratorSelectProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleAdd = () => {
    if (selectedUser && selectedRole) {
      const newCollaborator = {
        id: selectedUser.value,
        name: selectedUser.label,
        role: selectedRole.label
      };
      onSelect([...currentCollaborators, newCollaborator]);
      setSelectedUser(null);
      setSelectedRole(null);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      background: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(207, 251, 45, 0.2)',
      '&:hover': {
        borderColor: 'rgba(207, 251, 45, 0.4)'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      background: state.isFocused ? 'rgba(139, 48, 255, 0.2)' : 'transparent',
      color: state.isFocused ? '#CFFB2D' : '#fff'
    }),
    menu: (base: any) => ({
      ...base,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#CFFB2D'
    }),
    input: (base: any) => ({
      ...base,
      color: '#CFFB2D'
    })
  };

  return (
    <div className="space-y-4">
      <Select
        value={selectedUser}
        onChange={setSelectedUser}
        options={mockUsers}
        styles={customStyles}
        placeholder="Select Member"
        className="font-['Share_Tech_Mono']"
      />
      <Select
        value={selectedRole}
        onChange={setSelectedRole}
        options={roleOptions}
        styles={customStyles}
        placeholder="Select Role"
        className="font-['Share_Tech_Mono']"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        className="w-full rounded-lg bg-[#CFFB2D] px-4 py-2 font-['Orbitron'] text-black transition-colors hover:bg-[#8B30FF] hover:text-white"
        disabled={!selectedUser || !selectedRole}
      >
        Add Collaborator
      </motion.button>
    </div>
  );
}

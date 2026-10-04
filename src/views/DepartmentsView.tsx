import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { FolderTree, Users, Calendar, Clock, Plus, X } from 'lucide-react';
import { Department } from '../types';

export const DepartmentsView: React.FC = () => {
  const { departments, addDepartment, members, currentUser } = useChurch();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [meetingDay, setMeetingDay] = useState('Thursday');
  const [meetingTime, setMeetingTime] = useState('06:00 PM');
  const [color, setColor] = useState('#0f766e');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addDepartment({
      name,
      description,
      leaderId: 'mem-1',
      leaderName: leaderName || 'Grace Okafor',
      memberCount: 15,
      meetingDay,
      meetingTime,
      color,
    });
    setShowAddModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Departments & Ministry Groups</h1>
          <p className="text-xs text-slate-500">Organizing ministry teams, rehearsal schedules, and cell groups</p>
        </div>

        {currentUser?.role !== 'member' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => {
          const deptMembers = members.filter(m => m.departmentId === dept.id);
          return (
            <div 
              key={dept.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs"
                    style={{ backgroundColor: dept.color || '#0f766e' }}
                  >
                    <FolderTree className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {deptMembers.length || dept.memberCount} Members
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{dept.description}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
                <p>Leader: <strong className="text-slate-800">{dept.leaderName}</strong></p>
                {dept.assistantLeaderName && (
                  <p>Assistant: <span className="text-slate-700">{dept.assistantLeaderName}</span></p>
                )}
                <div className="pt-1 flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Meetings: {dept.meetingDay}s at {dept.meetingTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create New Department</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Children's Church"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ministry Description</label>
                <textarea
                  placeholder="What is the mission of this department?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden resize-none h-16"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leader Name</label>
                <input
                  type="text"
                  placeholder="Leader / Coordinator Name"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Day</label>
                  <input
                    type="text"
                    value={meetingDay}
                    onChange={(e) => setMeetingDay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Time</label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

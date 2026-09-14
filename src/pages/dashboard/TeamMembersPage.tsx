import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';
import { TeamMember } from '../../types';

export const TeamMembersPage: React.FC = () => {
  const { teamMembers, inviteTeamMember, removeTeamMember, addToast } = useStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Staff');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('Please provide both name and valid email address', 'error');
      return;
    }
    inviteTeamMember(name.trim(), email.trim(), role);
    addToast(`Invitation sent to ${email.trim()} for ${role} role!`, 'success');
    setName('');
    setEmail('');
    setIsInviteOpen(false);
  };

  const getRoleBadge = (r: TeamMember['role']) => {
    switch (r) {
      case 'Owner':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Staff':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Viewer':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Team Members & Permissions</h1>
          <p className="text-xs text-neutral-500">
            Manage your store operations staff, warehouse operators, and role-based access control (RBAC).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Team Cards / Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Active Team Roster ({teamMembers.length})
          </span>
          <span className="text-xs text-neutral-500">
            Seat usage: {teamMembers.length} / 10 available seats
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {member.name.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 text-sm">{member.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
                    {member.status === 'invited' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      {member.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {member.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {member.role !== 'Owner' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${member.name} from team?`)) {
                        removeTeamMember(member.id);
                        addToast(`Removed ${member.name}`, 'info');
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Matrix Info */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-xs">
        <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
          Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-bold text-neutral-900 block mb-1">Owner & Admin</span>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Full access to billing, banking settings, API keys, employee invitations, catalog deletion, and financial reports.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-bold text-neutral-900 block mb-1">Manager & Staff</span>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Can manage orders, dispatch shipments, update inventory stock movements, add products, and generate WhatsApp catalogs.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
            <span className="font-bold text-neutral-900 block mb-1">Viewer</span>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Read-only visibility for external accountants, auditors, and customer success agents. Cannot make stock or order edits.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-neutral-900">Invite Team Member</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              An email will be dispatched with single-sign-on workspace credentials.
            </p>

            <form onSubmit={handleInvite} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="ramesh@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Assign Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as TeamMember['role'])}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Admin">Admin (Full operations + settings)</option>
                  <option value="Manager">Manager (Catalog + stock + orders)</option>
                  <option value="Staff">Staff (Orders + fulfillment)</option>
                  <option value="Viewer">Viewer (Read-only analytics)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  BarChart3, Users, BookOpen, MessageSquare, Settings, Lock, Check, X, 
  AlertTriangle, Key, Plus, FileText, Send, Trash2, Calendar, ShieldCheck 
} from 'lucide-react';
import { domesticDestinations, internationalDestinations } from '../data/destinations';

const AdminPanel = ({ currentRole, inquiries, setInquiries, blogs, setBlogs }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogBody, setNewBlogBody] = useState('');

  // Destination pricing adjustments state
  const [packages, setPackages] = useState([
    ...domesticDestinations.map(d => ({ ...d, type: 'Domestic' })),
    ...internationalDestinations.map(d => ({ ...d, type: 'International' }))
  ]);

  // Mock staff list
  const [staff, setStaff] = useState([
    { id: 1, name: "Arumugam P", email: "arumugamp.blr@gmail.com", role: "Super admin", active: true },
    { id: 2, name: "Ranjith Kumar", email: "ranjith.k@takeatrip.com", role: "Admin", active: true },
    { id: 3, name: "Deepak Sharma", email: "deepak.editor@takeatrip.com", role: "Editor", active: true },
    { id: 4, name: "Sneha Rao", email: "sneha.author@takeatrip.com", role: "Author", active: true }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Author');

  // Simulated Audit logs
  const [logs] = useState([
    { time: "13:10", user: "Arumugam P", action: "Updated database schema configuration" },
    { time: "12:45", user: "Ranjith Kumar", action: "Approved custom quote for Vikram Sen" },
    { time: "11:22", user: "Deepak Sharma", action: "Edited itinerary detail for 'Dubai Glitz'" },
    { time: "09:05", user: "Sneha Rao", action: "Submitted new blog draft for review" }
  ]);

  // Permission Verification Helper
  const hasPermission = (requiredRoles) => {
    return requiredRoles.includes(currentRole.role);
  };

  // Sidebar Menu mapping
  const menuItems = [
    { id: 'overview', label: 'Console Hub', icon: <BarChart3 size={16} />, roles: ['Super admin', 'Admin', 'Editor', 'Author'] },
    { id: 'inquiries', label: 'Booking Desk', icon: <MessageSquare size={16} />, roles: ['Super admin', 'Admin', 'Editor'] },
    { id: 'packages', label: 'Package Rates', icon: <Calendar size={16} />, roles: ['Super admin', 'Admin', 'Editor'] },
    { id: 'staff', label: 'Staff Directory', icon: <Users size={16} />, roles: ['Super admin', 'Admin'] },
    { id: 'editorial', label: 'Editorial Studio', icon: <BookOpen size={16} />, roles: ['Super admin', 'Admin', 'Editor', 'Author'] },
    { id: 'settings', label: 'System Configurations', icon: <Settings size={16} />, roles: ['Super admin'] }
  ];

  // Actions: Approve Inquiry
  const handleApproveInquiry = (idx) => {
    const updated = [...inquiries];
    updated[idx].status = 'Approved';
    setInquiries(updated);
  };

  // Actions: Reject Inquiry
  const handleRejectInquiry = (idx) => {
    const updated = [...inquiries];
    updated[idx].status = 'Cancelled';
    setInquiries(updated);
  };

  // Actions: Update package price
  const handleUpdatePrice = (id, newPrice) => {
    const updated = packages.map(pkg => {
      if (pkg.id === id) {
        return { ...pkg, price: parseInt(newPrice) || 0 };
      }
      return pkg;
    });
    setPackages(updated);
  };

  // Actions: Write blog
  const handlePublishBlog = (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) return;

    const newBlog = {
      id: blogs.length + 1,
      title: newBlogTitle,
      author: currentRole.role === 'Author' ? 'Sneha Rao' : 'Administrator',
      status: currentRole.role === 'Author' ? 'Pending Review' : 'Published',
      date: new Date().toLocaleDateString(),
      views: 0
    };

    setBlogs([newBlog, ...blogs]);
    setNewBlogTitle('');
    setNewBlogBody('');
  };

  const handleApproveBlog = (id) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: 'Published' } : b));
  };

  // Actions: Add Staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    const item = {
      id: staff.length + 1,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      active: true
    };
    setStaff([...staff, item]);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // Access Gating Card
  const renderAccessGate = (allowedRoles) => {
    return (
      <div className="glass animate-float" style={{
        margin: '60px auto',
        maxWidth: '500px',
        padding: '40px',
        textAlign: 'center',
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '16px'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <Lock size={28} style={{ color: '#ef4444' }} />
        </div>
        <h3 style={{ fontSize: '1.4rem', color: '#ef4444', marginBottom: '10px' }}>Access Restricted</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
          Your active role (<strong style={{ color: currentRole.color }}>{currentRole.role}</strong>) does not have authorization to view this module.
        </p>
        
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-glass)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>Requires one of these roles:</span>
          {allowedRoles.join(', ')}
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '16px', color: 'var(--text-muted)' }}>
          💡 Use the floating <strong>Role Simulator</strong> widget in the bottom-left corner to switch roles.
        </p>
      </div>
    );
  };

  const currentTabAllowed = menuItems.find(item => item.id === activeTab)?.roles;
  const isTabAllowed = currentTabAllowed && hasPermission(currentTabAllowed);

  return (
    <div className="container" style={{ paddingTop: '110px', minHeight: '85vh', fontFamily: 'var(--font-sans)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Left Dashboard Sidebar */}
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{
            padding: '12px',
            background: 'var(--bg-input)',
            borderRadius: '10px',
            border: `1px solid ${currentRole.color}`,
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.1em' }}>Simulated User</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
              <ShieldCheck size={14} style={{ color: currentRole.color }} />
              <strong style={{ fontSize: '0.85rem' }}>{currentRole.role}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map(item => {
              const isAllowed = hasPermission(item.roles);
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                    color: isActive ? 'var(--color-primary)' : isAllowed ? 'var(--text-secondary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '600' : '400',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                    position: 'relative'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {!isAllowed && (
                    <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Dashboard Workspace */}
        <div style={{ minHeight: '600px' }}>
          {!isTabAllowed ? renderAccessGate(currentTabAllowed) : (
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: '600' }}>Operations Control Room</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Overview of business parameters, updates, and bookings.</p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div className="glass" style={{ padding: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue Estimates (MTD)</span>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                        {hasPermission(['Super admin']) ? '₹14,80,000' : '••••••'}
                      </h3>
                      <span style={{ fontSize: '0.65rem', color: '#10b981' }}>+12% vs last month</span>
                    </div>
                    <div className="glass" style={{ padding: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Inquiries</span>
                      <h3 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{inquiries.filter(i => i.status === 'Pending').length} Request(s)</h3>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Needs rapid processing</span>
                    </div>
                    <div className="glass" style={{ padding: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Published Blogs</span>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--color-secondary)', marginTop: '4px' }}>{blogs.filter(b => b.status === 'Published').length} Articles</h3>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{blogs.filter(b => b.status !== 'Published').length} drafts pending review</span>
                    </div>
                  </div>

                  {/* Operational Audit Logs / Feed */}
                  <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>System Logs & System Audit (Super Admin only)</h3>
                    
                    {hasPermission(['Super admin']) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {logs.map((log, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: '0.8rem',
                            borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            paddingBottom: '8px'
                          }}>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{log.time}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{log.user}:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                        <Lock size={12} />
                        <span>Audit logs are restricted to Super Admin role.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Booking Desk (Inquiries) */}
              {activeTab === 'inquiries' && (
                <div className="glass" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Customer Inquiry Desk</h2>
                  
                  {inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No incoming customer requests yet. Try submitting an inquiry on the Client view!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {inquiries.map((inq, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-glass)',
                          padding: '16px',
                          borderRadius: '12px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '1.0rem', display: 'block' }}>{inq.destination}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Received: {inq.submittedAt}</span>
                            </div>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              background: inq.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : inq.status === 'Pending' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: inq.status === 'Approved' ? '#10b981' : inq.status === 'Pending' ? 'var(--color-primary)' : '#ef4444'
                            }}>
                              {inq.status}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                            <div><strong>Duration:</strong> {inq.days} Days</div>
                            <div><strong>Travelers:</strong> {inq.travelers} Pax</div>
                            <div><strong>Hotel:</strong> {inq.hotelTier.toUpperCase()}</div>
                            <div><strong>Transport:</strong> {inq.transport.toUpperCase()}</div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                              ₹{inq.totalPrice.toLocaleString('en-IN')}
                            </span>
                            
                            {inq.status === 'Pending' && hasPermission(['Super admin', 'Admin']) && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => handleRejectInquiry(idx)}
                                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => handleApproveInquiry(idx)}
                                  style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                >
                                  Approve Quote
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Package Rates Editor */}
              {activeTab === 'packages' && (
                <div className="glass" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Regional Rates Editor</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {packages.map(pkg => (
                      <div key={pkg.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                        gap: '20px',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-glass)',
                        padding: '12px 20px',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{pkg.name}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pkg.type} Trip</span>
                        </div>

                        {/* Input editor field */}
                        <div>
                          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Adjust Base Cost (₹)</label>
                          <input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => handleUpdatePrice(pkg.id, e.target.value)}
                            disabled={!hasPermission(['Super admin', 'Admin'])} // Editor can view only, Admin/Super Admin can edit
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-glass)',
                              color: 'var(--text-primary)',
                              borderRadius: '6px',
                              outline: 'none',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>

                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {hasPermission(['Super admin', 'Admin']) ? (
                            <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Savable</span>
                          ) : (
                            <span>🔒 Read Only for Editor</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Directory */}
              {activeTab === 'staff' && (
                <div className="glass" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Internal Staff Accounts</h2>

                  {/* Add Staff form - Super admin only */}
                  {currentRole.role === 'Super admin' ? (
                    <form onSubmit={handleAddStaff} style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px dashed var(--border-glass)',
                      marginBottom: '20px',
                      alignItems: 'flex-end'
                    }}>
                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                        <input
                          type="text"
                          required
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          placeholder="Employee Name"
                          style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
                        <input
                          type="email"
                          required
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          placeholder="name@takeatripholidays.in"
                          style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Assign Role</label>
                        <select
                          value={newStaffRole}
                          onChange={(e) => setNewStaffRole(e.target.value)}
                          style={{ padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Author">Author</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>
                        Add Staff
                      </button>
                    </form>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      🔒 Adding/deleting staff accounts requires Super Admin authorization.
                    </div>
                  )}

                  {/* Staff Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Staff Name</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Role</th>
                        <th style={{ padding: '10px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(member => (
                        <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{member.name}</td>
                          <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{member.email}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: member.role === 'Super admin' ? 'rgba(239, 68, 68, 0.1)' : member.role === 'Admin' ? 'rgba(230, 180, 8, 0.1)' : member.role === 'Editor' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: member.role === 'Super admin' ? '#ef4444' : member.role === 'Admin' ? '#eab308' : member.role === 'Editor' ? '#3b82f6' : '#10b981',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {member.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', color: '#10b981' }}>Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Editorial Studio */}
              {activeTab === 'editorial' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Blog writers form */}
                  <div className="glass" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Compose Travel Article</h2>
                    
                    <form onSubmit={handlePublishBlog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Article Title</label>
                        <input
                          type="text"
                          required
                          value={newBlogTitle}
                          onChange={(e) => setNewBlogTitle(e.target.value)}
                          placeholder="e.g. Exploring the scenic routes of Munnar"
                          style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Article Content</label>
                        <textarea
                          required
                          rows={4}
                          value={newBlogBody}
                          onChange={(e) => setNewBlogBody(e.target.value)}
                          placeholder="Start writing travel guidelines or package details..."
                          style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', borderRadius: '8px', outline: 'none', fontFamily: 'var(--font-sans)' }}
                        />
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: 'max-content', borderRadius: '8px', padding: '10px 20px' }}>
                        {currentRole.role === 'Author' ? 'Submit for Review' : 'Publish Immediately'} <Send size={14} />
                      </button>
                    </form>
                  </div>

                  {/* Article drafts list */}
                  <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Article Moderation</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {blogs.map(b => (
                        <div key={b.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px'
                        }}>
                          <div>
                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{b.title}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {b.author} | {b.date}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              background: b.status === 'Published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                              color: b.status === 'Published' ? '#10b981' : 'var(--color-primary)'
                            }}>
                              {b.status}
                            </span>
                            
                            {b.status === 'Pending Review' && hasPermission(['Super admin', 'Admin', 'Editor']) && (
                              <button
                                onClick={() => handleApproveBlog(b.id)}
                                style={{
                                  background: 'rgba(16, 185, 129, 0.2)',
                                  color: '#10b981',
                                  border: 'none',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve & Publish
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings / System Configurations (Super admin only) */}
              {activeTab === 'settings' && (
                <div className="glass" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>System Master Settings</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Configure credentials and core API keys.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                        <Key size={14} style={{ color: 'var(--color-primary)' }} /> Razorpay Secret API Key (Production)
                      </label>
                      <input
                        type="password"
                        value="rzp_live_xxxxxxxxxxxxxxxx"
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-muted)',
                          borderRadius: '8px',
                          outline: 'none',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                        <Key size={14} style={{ color: 'var(--color-primary)' }} /> Sendgrid Mail API Token
                      </label>
                      <input
                        type="password"
                        value="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-muted)',
                          borderRadius: '8px',
                          outline: 'none',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div style={{
                      marginTop: '20px',
                      background: 'rgba(217, 119, 6, 0.05)',
                      border: '1px solid var(--border-glow)',
                      padding: '16px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <AlertTriangle size={18} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>Security Warning:</strong> These keys are currently loaded into memory based on secure environment variables. In a production environment, always verify that your server environment holds decryption certificates.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

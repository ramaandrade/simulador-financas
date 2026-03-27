import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getUsers, 
  updateAlumnPassword, 
  deleteUser, 
  batchRegisterAlumns, 
  updateAllAlumnsPassword,
  updateAlumn,
  updateSettings
} from '../utils/db';
import { useSettings } from '../hooks/useSettings';
import { RefreshCw, Trash2, Users, Home, Save, Edit, Key, Unlock, Shield } from 'lucide-react';

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('access');

  const moduleNames = [
    "Custos e Despesas",
    "Precificação",
    "Capital de Giro",
    "Planejamento Financeiro",
    "Crédito e Financiamento",
    "Investimentos",
    "KPIs"
  ];
  
  // Access Control State
  const [batchEmails, setBatchEmails] = useState('');
  const [globalPassword, setGlobalPassword] = useState('123456');
  
  // Edit Student State
  const [editingEmail, setEditingEmail] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  // Settings Modules State from Real-time Firestore Hook
  const settings = useSettings();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const list = await getUsers();
      setUsers(list.filter(u => u.role !== 'admin'));
    } catch(e) {
      console.error(e);
    }
  };

  const handleBatchRegister = async () => {
    if(!batchEmails.trim()) return alert("Cole alguns e-mails de alunos.");
    try {
      const added = await batchRegisterAlumns(batchEmails, globalPassword);
      alert(`Processo Concluído! ${added} novos alunos foram matriculados.`);
      setBatchEmails('');
      await loadUsers();
    } catch (e) {
      alert("Erro ao matricular lote: " + e.message);
    }
  };

  const handleGlobalPasswordUpdate = async () => {
    if(!globalPassword.trim() || globalPassword.length < 4) return alert("Senha muito fraca.");
    const isOk = window.confirm(`Certeza que deseja alterar a senha de TODOS os ${users.length} alunos cadastrados para "${globalPassword}"?`);
    if(isOk){
      await updateAllAlumnsPassword(globalPassword);
      alert("A Senha Unificada foi forçada para todos os alunos com sucesso!");
    }
  };

  const handleReset = async (email) => {
    const isOk = window.confirm(`Deseja resetar a senha de ${email} especificamente para a atual unificada (${globalPassword})?`);
    if (isOk) {
      await updateAlumnPassword(email, globalPassword);
      alert(`Senha resetada com sucesso para ${globalPassword}.`);
    }
  };

  const handleDelete = async (email) => {
    const isOk = window.confirm(`Deseja revogar o acesso de ${email} permanentemente?`);
    if (isOk) {
      await deleteUser(email);
      await loadUsers();
    }
  };

  const startEdit = (user) => {
    setEditingEmail(user.email);
    setEditForm({ name: user.name, email: user.email });
  };

  const saveEdit = async (oldEmail) => {
    try {
      await updateAlumn(oldEmail, editForm.email, editForm.name);
      setEditingEmail(null);
      await loadUsers();
    } catch(e) {
      alert(e.message);
    }
  };

  const toggleModule = async (key) => {
     const newVal = !settings[key];
     // Firestore will emit the new state back to useSettings instantly
     await updateSettings({ [key]: newVal });
  };

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div className="navbar-brand">
          <Shield size={24} /> Professor Root
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem' }}>
            <Home size={16} /> Início
          </button>
          <button className="btn-danger" onClick={logout} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>Sair</button>
        </div>
      </nav>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
         <button 
           className={activeTab === 'access' ? 'btn-primary' : 'btn-secondary'} 
           onClick={() => setActiveTab('access')}
           style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
         >
           <Users size={18} /> Controle de Acesso e Matrículas
         </button>
         <button 
           className={activeTab === 'modules' ? 'btn-primary' : 'btn-secondary'} 
           onClick={() => setActiveTab('modules')}
           style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
         >
           <Unlock size={18} /> Disponibilidade de Conteúdos
         </button>
      </div>

      {activeTab === 'access' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
             
             {/* Matricula Lote */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} color="var(--primary)"/> Matrícula de Alunos em Lote</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Cole abaixo todos os e-mails com acesso autorizado (separados por vírgula, espaço ou linha). Os alunos intrusos serão ignorados.</p>
                <textarea 
                   className="input-field" 
                   style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', marginBottom: '1rem' }}
                   placeholder="exemplo1@urca.br, exemplo2@urca.br..."
                   value={batchEmails}
                   onChange={e => setBatchEmails(e.target.value)}
                />
                <button className="btn-primary w-full" onClick={handleBatchRegister}>Adicionar à Whitelist</button>
             </div>

             {/* Senha Unificada */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={18} color="var(--warning)"/> Alterar Senha de Entrada Padrão</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Esta senha será imposta para <strong>todos os alunos cadastrados e para os novos</strong> que você matricular através do Lote.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <input 
                     type="text" 
                     className="input-field" 
                     value={globalPassword}
                     onChange={e => setGlobalPassword(e.target.value)}
                   />
                   <button className="btn-secondary" onClick={handleGlobalPasswordUpdate} style={{ whiteSpace: 'nowrap' }}>Forçar para Todos</button>
                </div>
             </div>

          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Alunos Autorizados ({users.length})
            </h2>
            
            {users.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Nenhum aluno matriculado na whitelist do simulador ainda.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>E-mail Local</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Nome ou ID de Identificação</th>
                      <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Gerenciamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '1.25rem 0.5rem', fontWeight: 500 }}>
                           {editingEmail === u.email ? (
                              <input type="email" className="input-field" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} />
                           ) : u.email}
                        </td>
                        <td style={{ padding: '1.25rem 0.5rem', color: 'var(--text-muted)' }}>
                           {editingEmail === u.email ? (
                              <input type="text" className="input-field" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} />
                           ) : u.name}
                        </td>
                        <td style={{ padding: '1.25rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            {editingEmail === u.email ? (
                               <button className="btn-primary" onClick={() => saveEdit(u.email)} title="Salvar Alterações" style={{ padding: '0.5rem' }}>
                                 <Save size={16} />
                               </button>
                            ) : (
                               <button className="btn-secondary" onClick={() => startEdit(u)} title="Alterar Cadastro" style={{ padding: '0.5rem' }}>
                                 <Edit size={16} />
                               </button>
                            )}
                            <button className="btn-secondary" onClick={() => handleReset(u.email)} title={`Resetar Senha para ${globalPassword}`} style={{ padding: '0.5rem' }}>
                              <RefreshCw size={16} />
                            </button>
                            <button className="btn-danger" onClick={() => handleDelete(u.email)} title="Expulsar Aluno" style={{ padding: '0.5rem', border: 'none' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Travar & Destravar Aulas (SubMódulos)</h2>
           <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Quando um módulo for travado aqui, o aluno o visualizará bloqueado (cinza e inacessível) durante a execução de seu próprio painel. Módulos que ainda não foram ensinados na sua disciplina devem permanecer trancados.</p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              
              {/* Marmitaria Blocks */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#10b981', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.5rem' }}>🍗 Trilhas da Marmitaria</h3>
                 {moduleNames.map((name, index) => {
                    const num = index + 1;
                    return (
                    <label key={`marmita_${num}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.5rem', background: settings[`marmitaria_${num}`] ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                       <span style={{ color: settings[`marmitaria_${num}`] ? 'var(--text-main)' : 'var(--text-muted)' }}>0{num}. {name}</span>
                       <input type="checkbox" checked={settings[`marmitaria_${num}`] || false} onChange={() => toggleModule(`marmitaria_${num}`)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#10b981' }}/>
                    </label>
                 )})}
              </div>

              {/* Padaria Blocks */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f59e0b', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.5rem' }}>🥖 Trilhas da Padaria</h3>
                 {moduleNames.map((name, index) => {
                    const num = index + 1;
                    return (
                    <label key={`padaria_${num}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.5rem', background: settings[`padaria_${num}`] ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                       <span style={{ color: settings[`padaria_${num}`] ? 'var(--text-main)' : 'var(--text-muted)' }}>0{num}. {name}</span>
                       <input type="checkbox" checked={settings[`padaria_${num}`] || false} onChange={() => toggleModule(`padaria_${num}`)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#f59e0b' }}/>
                    </label>
                 )})}
              </div>

              {/* Moda Fast Fashion Blocks */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#a855f7', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '0.5rem' }}>👗 Trilhas da Loja de Moda</h3>
                 {moduleNames.map((name, index) => {
                    const num = index + 1;
                    return (
                    <label key={`moda_${num}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.5rem', background: settings[`moda_${num}`] ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                       <span style={{ color: settings[`moda_${num}`] ? 'var(--text-main)' : 'var(--text-muted)' }}>0{num}. {name}</span>
                       <input type="checkbox" checked={settings[`moda_${num}`] || false} onChange={() => toggleModule(`moda_${num}`)} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#a855f7' }}/>
                    </label>
                 )})}
              </div>

           </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CadastroScreen from './screens/CadastroScreen';
import ListaScreen from './screens/ListaScreen';

export default function App() {
  const [screen, setScreen] = useState('cadastro');
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);

  const saveCliente = ({ nome, telefone, valor, forma, servico, observacoes }) => {
    if (editing) {
      setClientes(prev =>
        prev.map(c =>
          c.id === editing.id ? { ...c, nome: nome.trim(), telefone: telefone.trim(), valor, forma, servico, observacoes } : c
        )
      );
      setEditing(null);
      setScreen('lista');
      return;
    }
    const novo = {
      id: Date.now(),
      createdAt: Date.now(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      valor,
      forma,
      servico: servico?.trim() || '',
      observacoes: observacoes?.trim() || ''
    };
    setClientes(prev => [novo, ...prev]);
    setScreen('lista');
  };

  const startEdit = (cliente) => {
    setEditing(cliente);
    setScreen('cadastro');
  };

  const deleteCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Salão Da Moza</Text>
        <Text style={styles.subtitle}>Cadastro de Clientes</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, screen === 'cadastro' && styles.tabActive]}
            onPress={() => setScreen('cadastro')}
          >
            <Text style={[styles.tabText, screen === 'cadastro' && styles.tabTextActive]}>Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, screen === 'lista' && styles.tabActive]}
            onPress={() => setScreen('lista')}
          >
            <Text style={[styles.tabText, screen === 'lista' && styles.tabTextActive]}>Lista</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        {screen === 'cadastro' ? (
          <CadastroScreen onSave={saveCliente} editingCliente={editing} onCancel={() => { setEditing(null); setScreen('lista'); }} />
        ) : (
          <ListaScreen clientes={clientes} onEdit={startEdit} onDelete={deleteCliente} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: '#0f172a' },
  brand: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  tabs: { flexDirection: 'row', marginTop: 12, gap: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#1f2937' },
  tabActive: { backgroundColor: '#e11d48' },
  tabText: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#0f172a' },
  content: { flex: 1, backgroundColor: '#0f172a', padding: 20 }
});

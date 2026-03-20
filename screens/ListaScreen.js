import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ClienteItem from '../components/ClienteItem';

export default function ListaScreen({ clientes, onEdit, onDelete }) {
  const [filtro, setFiltro] = useState('todos');
  const [forma, setForma] = useState('todos');
  const [query, setQuery] = useState('');
  const hoje = new Date();
  const isSameDay = (ts) => {
    const d = new Date(ts || Date.now());
    return d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth() && d.getDate() === hoje.getDate();
  };

  const resumo = useMemo(() => {
    let base = filtro === 'hoje' ? clientes.filter(c => isSameDay(c.createdAt)) : clientes;
    if (forma !== 'todos') base = base.filter(c => c.forma === forma);
    if (query.trim()) base = base.filter(c => c.nome.toLowerCase().includes(query.trim().toLowerCase()));
    const totalClientes = base.length;
    const totalRecebido = base.reduce((acc, c) => acc + (Number(c.valor) || 0), 0);
    const byForma = ['PIX', 'Cartão', 'Dinheiro'].map(f => ({
      forma: f,
      total: base.filter(c => c.forma === f).reduce((acc, c) => acc + (Number(c.valor) || 0), 0),
      count: base.filter(c => c.forma === f).length
    }));
    return { totalClientes, totalRecebido, byForma, base };
  }, [clientes, filtro, forma, query]);

  const metaClientes = 20;
  const metaReceita = 1000;
  const pctClientes = Math.min(1, resumo.totalClientes / metaClientes);
  const pctReceita = Math.min(1, resumo.totalRecebido / metaReceita);

  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        <Text style={styles.heading}>Clientes cadastrados</Text>
        <View style={styles.filters}>
          {['todos', 'hoje'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFiltro(f)} style={[styles.filterBtn, filtro === f && styles.filterActive]}>
              <Text style={[styles.filterText, filtro === f && styles.filterTextActive]}>{f === 'todos' ? 'Todos' : 'Hoje'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.filters, { marginTop: 8 }]}>
          {['todos', 'PIX', 'Cartão', 'Dinheiro'].map(f => (
            <TouchableOpacity key={f} onPress={() => setForma(f)} style={[styles.filterBtn, forma === f && styles.filterActive]}>
              <Text style={[styles.filterText, forma === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nome"
          placeholderTextColor="#94a3b8"
          style={styles.search}
        />
        <Text style={styles.count}>{resumo.totalClientes} registro(s) • R$ {resumo.totalRecebido.toFixed(2)}</Text>
        <View style={styles.break}>
          {resumo.byForma.map(b => (
            <Text key={b.forma} style={styles.breakText}>{b.forma}: R$ {b.total.toFixed(2)} ({b.count})</Text>
          ))}
        </View>
        <View style={styles.goalBox}>
          <Text style={styles.goalTitle}>Meta diária</Text>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Clientes</Text>
            <Text style={styles.goalValue}>{resumo.totalClientes}/{metaClientes}</Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalFill, { width: `${pctClientes * 100}%` }]} />
          </View>
          <View style={[styles.goalRow, { marginTop: 8 }]}>
            <Text style={styles.goalLabel}>Receita</Text>
            <Text style={styles.goalValue}>R$ {resumo.totalRecebido.toFixed(2)} / R$ {metaReceita.toFixed(2)}</Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalFillAlt, { width: `${pctReceita * 100}%` }]} />
          </View>
        </View>
      </View>
      {resumo.base.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
        </View>
      ) : (
        <FlatList
          data={resumo.base}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ClienteItem
              nome={item.nome}
              telefone={item.telefone}
              valor={item.valor}
              forma={item.forma}
              servico={item.servico}
              observacoes={item.observacoes}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  top: { marginBottom: 12 },
  heading: { color: '#e5e7eb', fontSize: 16, fontWeight: '600' },
  filters: { flexDirection: 'row', gap: 8, marginTop: 8 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#1f2937' },
  filterActive: { backgroundColor: '#06b6d4' },
  filterText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0f172a' },
  count: { color: '#94a3b8', fontSize: 12, marginTop: 8 },
  break: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  breakText: { color: '#cbd5e1', fontSize: 12 },
  goalBox: { marginTop: 10, backgroundColor: '#0b1220', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1f2937' },
  goalTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: '700' },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  goalLabel: { color: '#cbd5e1', fontSize: 12 },
  goalValue: { color: '#cbd5e1', fontSize: 12, fontWeight: '700' },
  goalBar: { height: 8, backgroundColor: '#1f2937', borderRadius: 6, overflow: 'hidden', marginTop: 6 },
  goalFill: { height: 8, backgroundColor: '#06b6d4' },
  goalFillAlt: { height: 8, backgroundColor: '#22c55e' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 14 }
  ,search: { marginTop: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#374151', color: '#f8fafc', backgroundColor: '#0b1220' }
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClienteItem({ nome, telefone, valor, forma, servico, observacoes, onEdit, onDelete }) {
  const initials = nome.trim().split(' ').slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('');
  const colors = ['#e11d48', '#06b6d4', '#22c55e', '#f59e0b'];
  const color = colors[(nome.length || 0) % colors.length];
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.telefone}>{telefone}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <Text style={styles.meta}>R$ {Number(valor || 0).toFixed(2)}</Text>
            <Text style={styles.meta}>• {forma}</Text>
          </View>
          {!!servico && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{servico}</Text>
            </View>
          )}
          {!!observacoes && (
            <Text numberOfLines={2} style={styles.notes}>{observacoes}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={[styles.actionBtn, styles.edit]} activeOpacity={0.8}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, styles.delete]} activeOpacity={0.8}>
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: '#111827', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0f172a', fontSize: 14, fontWeight: '700' },
  nome: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  telefone: { color: '#cbd5e1', fontSize: 14, marginTop: 2 },
  meta: { color: '#94a3b8', fontSize: 12 },
  chip: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: '#1f2937', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8 },
  chipText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  notes: { color: '#94a3b8', fontSize: 12, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  edit: { backgroundColor: '#06b6d4' },
  delete: { backgroundColor: '#ef4444' },
  actionText: { color: '#0f172a', fontSize: 12, fontWeight: '700' }
});

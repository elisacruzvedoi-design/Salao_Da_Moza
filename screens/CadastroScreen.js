import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CadastroScreen({ onSave, editingCliente, onCancel }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [forma, setForma] = useState('PIX');
  const [servico, setServico] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [touched, setTouched] = useState(false);

  const digits = telefone.replace(/\D/g, '');
  const validValor = parseFloat(String(valor).replace(',', '.')) > 0;
  const validServico = servico.trim().length > 0;
  const valid = nome.trim().length > 0 && digits.length >= 10 && validValor && !!forma && validServico;

  useEffect(() => {
    if (editingCliente) {
      setNome(editingCliente.nome || '');
      setTelefone(editingCliente.telefone || '');
      setValor(String(editingCliente.valor ?? ''));
      setForma(editingCliente.forma || 'PIX');
      setServico(editingCliente.servico || '');
      setObservacoes(editingCliente.observacoes || '');
    }
  }, [editingCliente]);

  const handleSave = () => {
    setTouched(true);
    if (!valid) return;
    const num = parseFloat(String(valor).replace(',', '.'));
    onSave({ nome, telefone, valor: Number.isNaN(num) ? 0 : num, forma, servico, observacoes });
    setNome('');
    setTelefone('');
    setValor('');
    setForma('PIX');
    setServico('');
    setObservacoes('');
    setTouched(false);
  };

  const showNomeError = touched && nome.trim().length === 0;
  const showTelefoneError = touched && digits.length < 10;
  const showValorError = touched && !validValor;
  const showServicoError = touched && !validServico;

  const formatPhone = (value) => {
    const only = value.replace(/\D/g, '').slice(0, 11);
    if (only.length <= 2) return only;
    if (only.length <= 6) return `(${only.slice(0, 2)}) ${only.slice(2)}`;
    if (only.length <= 10) return `(${only.slice(0, 2)}) ${only.slice(2, 6)}-${only.slice(6)}`;
    return `(${only.slice(0, 2)}) ${only.slice(2, 7)}-${only.slice(7)}`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Informe o nome"
          placeholderTextColor="#94a3b8"
          style={[styles.input, showNomeError && styles.inputError]}
        />
        {showNomeError && <Text style={styles.error}>Obrigatório</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Telefone</Text>
        <TextInput
          value={telefone}
          onChangeText={(t) => setTelefone(formatPhone(t))}
          placeholder="(xx) xxxx-xxxx"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          style={[styles.input, showTelefoneError && styles.inputError]}
        />
        {showTelefoneError && <Text style={styles.error}>Informe um telefone válido</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Serviço realizado</Text>
        <TextInput
          value={servico}
          onChangeText={setServico}
          placeholder="Corte, Escova, Manicure..."
          placeholderTextColor="#94a3b8"
          style={[styles.input, showServicoError && styles.inputError]}
        />
        {showServicoError && <Text style={styles.error}>Informe o serviço</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Valor (R$)</Text>
        <TextInput
          value={valor}
          onChangeText={setValor}
          placeholder="0,00"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          style={[styles.input, showValorError && styles.inputError]}
        />
        {showValorError && <Text style={styles.error}>Informe um valor válido</Text>}

        <Text style={[styles.label, { marginTop: 16 }]}>Forma de pagamento</Text>
        <View style={styles.segment}>
          {['PIX', 'Cartão', 'Dinheiro'].map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => setForma(opt)}
              style={[styles.segmentBtn, forma === opt && styles.segmentActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, forma === opt && styles.segmentTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Observações</Text>
        <TextInput
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Preferências, observações do atendimento..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity onPress={handleSave} style={[styles.button, !valid && styles.buttonDisabled]} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        {editingCliente && (
          <TouchableOpacity onPress={onCancel} style={[styles.buttonGhost]} activeOpacity={0.8}>
            <Text style={styles.buttonGhostText}>Cancelar edição</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: 'center' },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  label: { color: '#e5e7eb', fontSize: 14, fontWeight: '500' },
  input: { marginTop: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#374151', color: '#f8fafc', backgroundColor: '#0b1220' },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', fontSize: 12, marginTop: 6 },
  button: { marginTop: 20, backgroundColor: '#e11d48', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#0f172a', fontSize: 16, fontWeight: '600' },
  segment: { flexDirection: 'row', gap: 8, marginTop: 8 },
  segmentBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#1f2937' },
  segmentActive: { backgroundColor: '#06b6d4' },
  segmentText: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' },
  segmentTextActive: { color: '#0f172a' },
  buttonGhost: { marginTop: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  buttonGhostText: { color: '#cbd5e1', fontSize: 16, fontWeight: '600' }
});

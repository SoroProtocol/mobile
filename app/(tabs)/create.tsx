import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState } from 'react';
import { Colors }  from '@/constants/Colors';
import { Layout }  from '@/constants/Layout';

const T = Colors.dark;

interface Form {
  recipient:  string;
  ratePerDay: string;
  startDate:  string;
  stopDate:   string;
}

export default function CreateStream() {
  const [form,   setForm]   = useState<Form>({ recipient: '', ratePerDay: '', startDate: '', stopDate: '' });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  function update(key: keyof Form, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Form> = {};
    if (!/^G[A-Z2-7]{55}$/.test(form.recipient)) e.recipient  = 'Invalid Stellar address';
    if (!form.ratePerDay || Number(form.ratePerDay) <= 0) e.ratePerDay = 'Must be > 0';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.stopDate)  e.stopDate  = 'Required';
    if (form.startDate && form.stopDate && new Date(form.stopDate) <= new Date(form.startDate))
      e.stopDate = 'Must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setStatus('submitting');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <View style={styles.centered}>
        <Text style={styles.check}>✓</Text>
        <Text style={styles.successTitle}>Stream Created!</Text>
        <TouchableOpacity style={styles.btn} onPress={() => setStatus('idle')}>
          <Text style={styles.btnText}>Create Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>New Payment Stream</Text>

        {([
          { key: 'recipient',  label: 'Recipient Address', placeholder: 'G...' },
          { key: 'ratePerDay', label: 'Rate (XLM / day)',  placeholder: 'e.g. 10' },
          { key: 'startDate',  label: 'Start (YYYY-MM-DD)',placeholder: '2026-01-01' },
          { key: 'stopDate',   label: 'End (YYYY-MM-DD)',  placeholder: '2026-12-31' },
        ] as { key: keyof Form; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={[styles.input, errors[key] && styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor={T.textMuted}
              value={form[key]}
              onChangeText={v => update(key, v)}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={label}
            />
            {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btn, status === 'submitting' && styles.btnDisabled]}
          onPress={submit}
          disabled={status === 'submitting'}
        >
          <Text style={styles.btnText}>
            {status === 'submitting' ? 'Creating…' : 'Create Stream'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: T.bg },
  scroll:  { padding: Layout.spacing.md },
  title:   { color: T.text, fontSize: 22, fontWeight: '700', marginBottom: Layout.spacing.lg },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg },
  check:   { fontSize: 48, color: T.success, marginBottom: 12 },
  successTitle: { color: T.text, fontSize: 20, fontWeight: '700', marginBottom: 16 },

  field: { marginBottom: Layout.spacing.md },
  label: { color: T.textMuted, fontSize: 13, marginBottom: 6, fontWeight: '500' },

  input: {
    backgroundColor: T.surface,
    borderWidth: 1, borderColor: T.border,
    borderRadius: Layout.radius.md,
    color: T.text,
    padding: Layout.spacing.sm + 4,
    fontSize: 15,
  },
  inputError: { borderColor: T.danger },
  error: { color: T.danger, fontSize: 12, marginTop: 4 },

  btn: {
    backgroundColor: T.accent,
    borderRadius:    Layout.radius.md,
    padding:         Layout.spacing.md,
    alignItems:      'center',
    marginTop:       Layout.spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: '#fff', fontWeight: '700', fontSize: 16 },
});

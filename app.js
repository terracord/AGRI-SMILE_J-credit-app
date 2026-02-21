import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const e = React.createElement;

const phases = [
  {
    id: 'phase1',
    label: 'プロジェクト登録（プロジェクト申込）',
    steps: [{ id: 'field', label: '基本情報入力', title: '基本情報を入力' }],
  },
  {
    id: 'phase2',
    label: 'プロジェクト登録（BS減肥効果実測）',
    steps: [
      { id: 'fertilizer', label: '施肥入力', title: '肥料の記録' },
      { id: 'bs', label: 'BS使用入力', title: 'バイオ炭の記録' },
    ],
  },
  {
    id: 'phase3',
    label: 'BS減肥効果実測（初年度）',
    steps: [{ id: 'harvest', label: '収穫量入力', title: '収穫の記録' }],
  },
  {
    id: 'phase4',
    label: 'プロジェクト活動中',
    steps: [
      { id: 'machine', label: '農機作業入力', title: '機械作業の記録' },
      { id: 'receipt', label: '証憑アップロード', title: '証明書類を保存' },
    ],
  },
  {
    id: 'phase5',
    label: 'モニタリング・認証',
    steps: [{ id: 'yearly', label: '年間まとめ表示', title: '年間のまとめ' }],
  },
];

const initialState = {
  farmName: '', representativeName: '', location: '', fieldNumber: '',
  locationDataName: '', targetFieldAreaHa: '', cropType: '', cultivationMethod: '',
  similarProgramRegistered: false,
  fertilizerType: '', fertilizerAmount: '', bsDate: '', bsAmount: '',
  harvestDate: '', harvestAmount: '', machineDate: '', machineTask: '', receiptName: '',
};

function FormSection({ children }) {
  return e('section', { className: 'form-section' }, children);
}

function App() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [maxUnlockedPhase, setMaxUnlockedPhase] = useState(0);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(initialState);

  const currentPhase = phases[phaseIndex];
  const currentStep = currentPhase.steps[stepIndex];

  const updateField = (key) => (event) => {
    let value = event.target.value;
    if (key === 'receiptName' || key === 'locationDataName') {
      value = event.target.files?.[0]?.name || '';
    }
    if (key === 'similarProgramRegistered') {
      value = event.target.checked;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setNotice('');
  };

  const isPhaseComplete = (index) => {
    if (index === 0) {
      return Boolean(
        form.farmName
        && form.representativeName
        && form.location
        && form.fieldNumber
        && form.locationDataName
        && form.targetFieldAreaHa
        && form.cropType
        && form.cultivationMethod,
      );
    }
    if (index === 1) {
      return Boolean(form.fertilizerType && form.fertilizerAmount && form.bsDate && form.bsAmount);
    }
    if (index === 2) {
      return Boolean(form.harvestDate && form.harvestAmount);
    }
    if (index === 3) {
      return Boolean(form.machineDate && form.machineTask && form.receiptName);
    }
    return true;
  };

  const yearSummary = useMemo(() => [
    ['農業経営体名', form.farmName || '未入力'],
    ['代表者名', form.representativeName || '未入力'],
    ['所在地', form.location || '未入力'],
    ['圃場番号・地番', form.fieldNumber || '未入力'],
    ['圃場位置図・GISデータ', form.locationDataName || '未アップロード'],
    ['対象の圃場面積', form.targetFieldAreaHa ? `${form.targetFieldAreaHa} ha` : '未入力'],
    ['作物種類', form.cropType || '未入力'],
    ['栽培方法', form.cultivationMethod || '未入力'],
    ['類似制度への登録', form.similarProgramRegistered ? '登録あり' : '登録なし'],
    ['肥料の量', form.fertilizerAmount ? `${form.fertilizerAmount} kg` : '未入力'],
    ['バイオ炭の量', form.bsAmount ? `${form.bsAmount} kg` : '未入力'],
    ['収穫量', form.harvestAmount ? `${form.harvestAmount} kg` : '未入力'],
    ['機械作業', form.machineTask || '未入力'],
    ['証明書類', form.receiptName || '未アップロード'],
  ], [form]);

  const contentByPage = {
    field: e(FormSection, {}, [
      e('p', { key: 'basic', className: 'section-title' }, '＜基本情報＞'),
      e('label', { key: 'f1' }, ['農業経営体名', e('input', { type: 'text', value: form.farmName, onChange: updateField('farmName'), placeholder: '例：○○農園' })]),
      e('label', { key: 'f2' }, ['代表者名', e('input', { type: 'text', value: form.representativeName, onChange: updateField('representativeName'), placeholder: '例：山田 太郎' })]),
      e('label', { key: 'f3' }, ['所在地', e('input', { type: 'text', value: form.location, onChange: updateField('location'), placeholder: '例：新潟県○○市' })]),
      e('label', { key: 'f4' }, ['圃場番号・地番', e('input', { type: 'text', value: form.fieldNumber, onChange: updateField('fieldNumber'), placeholder: '例：A-12 / 123-4' })]),
      e('label', { key: 'f5' }, ['圃場位置図・GISデータ', e('input', { type: 'file', onChange: updateField('locationDataName') })]),
      e('p', { key: 'f6', className: 'hint' }, `保存されたファイル名：${form.locationDataName || 'まだありません'}`),
      e('label', { key: 'f7' }, ['対象の圃場面積（ha）', e('input', { type: 'number', min: '0', step: '0.01', value: form.targetFieldAreaHa, onChange: updateField('targetFieldAreaHa'), placeholder: '例：1.25' })]),
      e('label', { key: 'f8' }, ['作物種類（品目）', e('input', { type: 'text', value: form.cropType, onChange: updateField('cropType'), placeholder: '例：水稲' })]),
      e('label', { key: 'f9' }, ['栽培方法（露地／施設等）', e('input', { type: 'text', value: form.cultivationMethod, onChange: updateField('cultivationMethod'), placeholder: '例：露地' })]),
      e('label', { key: 'f10', className: 'check-label' }, [
        e('input', { type: 'checkbox', checked: form.similarProgramRegistered, onChange: updateField('similarProgramRegistered') }),
        '類似制度へプロジェクトに登録している',
      ]),
    ]),
    fertilizer: e(FormSection, {}, [
      e('label', { key: 'n1' }, ['肥料の種類', e('input', { type: 'text', value: form.fertilizerType, onChange: updateField('fertilizerType'), placeholder: '例：有機肥料' })]),
      e('label', { key: 'n2' }, ['使った量（kg）', e('input', { type: 'number', min: '0', value: form.fertilizerAmount, onChange: updateField('fertilizerAmount'), placeholder: '例：120' })]),
    ]),
    bs: e(FormSection, {}, [
      e('label', { key: 'b1' }, ['使った日', e('input', { type: 'date', value: form.bsDate, onChange: updateField('bsDate') })]),
      e('label', { key: 'b2' }, ['使った量（kg）', e('input', { type: 'number', min: '0', value: form.bsAmount, onChange: updateField('bsAmount'), placeholder: '例：40' })]),
    ]),
    harvest: e(FormSection, {}, [
      e('label', { key: 'h1' }, ['収穫日', e('input', { type: 'date', value: form.harvestDate, onChange: updateField('harvestDate') })]),
      e('label', { key: 'h2' }, ['収穫量（kg）', e('input', { type: 'number', min: '0', value: form.harvestAmount, onChange: updateField('harvestAmount'), placeholder: '例：520' })]),
    ]),
    machine: e(FormSection, {}, [
      e('label', { key: 'm1' }, ['作業日', e('input', { type: 'date', value: form.machineDate, onChange: updateField('machineDate') })]),
      e('label', { key: 'm2' }, ['作業内容', e('input', { type: 'text', value: form.machineTask, onChange: updateField('machineTask'), placeholder: '例：田起こし' })]),
    ]),
    receipt: e(FormSection, {}, [
      e('label', { key: 'r1' }, ['ファイルを選ぶ', e('input', { type: 'file', onChange: updateField('receiptName') })]),
      e('p', { key: 'r2', className: 'hint' }, `保存されたファイル名：${form.receiptName || 'まだありません'}`),
    ]),
    yearly: e('section', { className: 'summary-list', 'aria-live': 'polite' }, [
      ...yearSummary.map(([label, value]) => e('article', { key: label, className: 'summary-item' }, [e('p', { key: 1 }, label), e('strong', { key: 2 }, value)])),
      e('p', { key: 'note', className: 'hint' }, '※算定ロジックはモックのため実装していません。'),
    ]),
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return;
    }
    if (phaseIndex > 0) {
      const prevPhaseIndex = phaseIndex - 1;
      setPhaseIndex(prevPhaseIndex);
      setStepIndex(phases[prevPhaseIndex].steps.length - 1);
    }
  };

  const goNext = () => {
    if (stepIndex < currentPhase.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    if (!isPhaseComplete(phaseIndex)) {
      setNotice('このフェーズの入力が未完了です。必須項目を入力してください。');
      return;
    }

    if (phaseIndex < phases.length - 1) {
      const nextPhaseIndex = phaseIndex + 1;
      setMaxUnlockedPhase(Math.max(maxUnlockedPhase, nextPhaseIndex));
      setPhaseIndex(nextPhaseIndex);
      setStepIndex(0);
      setNotice('');
    }
  };

  return e('div', { className: 'app-shell' }, [
    e('header', { key: 'header', className: 'app-header' }, [
      e('h1', { key: 1 }, '農作業の記録アプリ（モック）'),
      e('p', { key: 2 }, '5つのフェーズで順番に入力します。前のフェーズ完了で次に進めます。'),
    ]),
    e('nav', { key: 'phase-nav', className: 'phase-nav', 'aria-label': 'フェーズ一覧' },
      phases.map((phase, index) => e('button', {
        key: phase.id,
        type: 'button',
        disabled: index > maxUnlockedPhase,
        className: `phase-chip ${index === phaseIndex ? 'is-active' : ''}`,
        onClick: () => {
          setPhaseIndex(index);
          setStepIndex(0);
          setNotice('');
        },
      }, `${index + 1}. ${phase.label}`))),
    e('div', { key: 'phase-info', className: 'phase-info' }, [
      e('strong', { key: 'phase-title' }, currentPhase.label),
      e('p', { key: 'step-title' }, `入力項目：${currentStep.label}`),
    ]),
    e('main', { key: 'main', className: 'card' }, [
      e('h2', { key: 'h2' }, currentStep.title),
      e('div', { key: 'content' }, contentByPage[currentStep.id]),
      notice ? e('p', { key: 'notice', className: 'notice' }, notice) : null,
      e('footer', { key: 'f', className: 'footer-actions' }, [
        e('button', { key: 'p', type: 'button', disabled: phaseIndex === 0 && stepIndex === 0, onClick: goPrev }, '前へ'),
        e('button', { key: 'n', type: 'button', disabled: phaseIndex === phases.length - 1, onClick: goNext }, stepIndex === currentPhase.steps.length - 1 ? '次のフェーズへ' : '次へ'),
      ]),
    ]),
  ]);
}

createRoot(document.getElementById('root')).render(e(App));

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
      { id: 'fertilizer', label: '使用条件入力', title: '使用条件と影響度を入力' },
      { id: 'bs', label: 'BS情報入力', title: 'BS関連情報を入力' },
    ],
  },
  {
    id: 'phase3',
    label: 'BS減肥効果実測（初年度）',
    steps: [{ id: 'harvest', label: '初年度データ入力', title: '初年度データを入力' }],
  },
  {
    id: 'phase4',
    label: 'プロジェクト活動中',
    steps: [
      { id: 'machine', label: '活動データ入力', title: '活動データを入力' },
      { id: 'receipt', label: '証憑入力', title: '証憑を入力' },
    ],
  },
  {
    id: 'phase5',
    label: 'モニタリング・認証',
    steps: [{ id: 'yearly', label: '認証データ入力', title: '認証データを入力' }],
  },
];

const createFertilizerRow = () => ({
  name: '',
  annualAmount: '',
  nitrogenRate: '',
  purchaseRecordName: '',
});

const createBsMaterialRow = () => ({
  materialName: '',
  certificateName: '',
  usageDateTime: '',
  usageMethod: '',
  usageAmount: '',
  usageCount: '',
  dilutionRate: '',
});

const initialState = {
  farmName: '', representativeName: '', location: '', fieldNumber: '',
  locationDataName: '', targetFieldAreaHa: '', cropType: '', cultivationMethod: '',
  similarProgramRegistered: false,

  fertilizers: [createFertilizerRow()],
  fieldTestStart: '', fieldTestEnd: '',
  fieldTestDesignNames: ['', '', '', ''],
  fertilizerWorkCount: '', machineType: '', annualFuelUsage: '',

  bsMaterials: [createBsMaterialRow()],

  conventionalFertilizerPerHa: '', reducedFertilizerPerHa: '', fertilizerReductionRate: '', firstYearNitrogenRate: '',
  conventionalYield: '', reducedBsYield: '', firstYearBsDate: '', firstYearBsUsage: '',
  productionRecordName: '', jaConfirmationName: '',

  bsFieldAreaHa: '', activityFertilizerDate: '', activityFertilizerName: '', activityFertilizerAmountKg: '',
  activityFertilizerPerArea: '', activityNitrogenRate: '', fieldYearlyYield: '', shippingRecordName: '',

  fertilizingFuelUsage: '', bsSprayFuelUsage: '', fertilizerTransportFuelUsage: '', bsTransportFuelUsage: '',
  cropChanged: false, cultivationChanged: false,
  finalCultivationArea: '', finalAnnualFertilizer: '', finalAnnualYield: '',
  n2oFactorLatest: '', gwpLatest: '', fuelFactor: '',
  fuelInvoiceName: '', monitoringBsCertificateName: '', monitoringJaConfirmationName: '', monitoringFieldMapName: '',
  receiptName: '',
};

function FormSection({ children }) {
  return e('section', { className: 'form-section' }, children);
}

function App() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(initialState);

  const currentPhase = phases[phaseIndex];
  const currentStep = currentPhase.steps[stepIndex];

  const updateField = (key) => (event) => {
    let value = event.target.value;
    if (event.target.type === 'file') {
      value = event.target.files?.[0]?.name || '';
    }
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateFertilizer = (index, key) => (event) => {
    const value = key === 'purchaseRecordName' ? event.target.files?.[0]?.name || '' : event.target.value;
    setForm((prev) => {
      const rows = [...prev.fertilizers];
      rows[index] = { ...rows[index], [key]: value };
      return { ...prev, fertilizers: rows };
    });
  };

  const addFertilizer = () => {
    setForm((prev) => ({ ...prev, fertilizers: [...prev.fertilizers, createFertilizerRow()] }));
  };

  const updateBsMaterial = (index, key) => (event) => {
    const value = key === 'certificateName' ? event.target.files?.[0]?.name || '' : event.target.value;
    setForm((prev) => {
      const rows = [...prev.bsMaterials];
      rows[index] = { ...rows[index], [key]: value };
      return { ...prev, bsMaterials: rows };
    });
  };

  const addBsMaterial = () => {
    setForm((prev) => ({ ...prev, bsMaterials: [...prev.bsMaterials, createBsMaterialRow()] }));
  };

  const updateDesignFile = (index) => (event) => {
    const value = event.target.files?.[0]?.name || '';
    setForm((prev) => {
      const names = [...prev.fieldTestDesignNames];
      names[index] = value;
      return { ...prev, fieldTestDesignNames: names };
    });
  };

  const yearSummary = useMemo(() => [
    ['農業経営体名', form.farmName || '未入力'],
    ['使用肥料の件数', `${form.fertilizers.length}件`],
    ['BS資材の件数', `${form.bsMaterials.length}件`],
    ['圃場試験期間', form.fieldTestStart && form.fieldTestEnd ? `${form.fieldTestStart} 〜 ${form.fieldTestEnd}` : '未入力'],
    ['BS使用圃場面積', form.bsFieldAreaHa ? `${form.bsFieldAreaHa} ha` : '未入力'],
    ['最終年間収穫量', form.finalAnnualYield || '未入力'],
  ], [form]);

  const contentByPage = {
    field: e(FormSection, {}, [
      e('p', { key: 's1', className: 'section-title' }, '＜基本情報＞'),
      e('label', { key: 'f1' }, ['農業経営体名', e('input', { type: 'text', value: form.farmName, onChange: updateField('farmName') })]),
      e('label', { key: 'f2' }, ['代表者名', e('input', { type: 'text', value: form.representativeName, onChange: updateField('representativeName') })]),
      e('label', { key: 'f3' }, ['所在地', e('input', { type: 'text', value: form.location, onChange: updateField('location') })]),
      e('label', { key: 'f4' }, ['圃場番号・地番', e('input', { type: 'text', value: form.fieldNumber, onChange: updateField('fieldNumber') })]),
      e('label', { key: 'f5' }, ['圃場位置図・GISデータ', e('input', { type: 'file', onChange: updateField('locationDataName') })]),
      e('p', { key: 'f6', className: 'hint' }, `保存されたファイル名：${form.locationDataName || 'まだありません'}`),
      e('label', { key: 'f7' }, ['対象の圃場面積（ha）', e('input', { type: 'number', min: '0', step: '0.01', value: form.targetFieldAreaHa, onChange: updateField('targetFieldAreaHa') })]),
      e('label', { key: 'f8' }, ['作物種類（品目）', e('input', { type: 'text', value: form.cropType, onChange: updateField('cropType') })]),
      e('label', { key: 'f9' }, ['栽培方法（露地／施設等）', e('input', { type: 'text', value: form.cultivationMethod, onChange: updateField('cultivationMethod') })]),
      e('label', { key: 'f10', className: 'check-label' }, [e('input', { type: 'checkbox', checked: form.similarProgramRegistered, onChange: updateField('similarProgramRegistered') }), '類似制度へプロジェクトに登録しているか']),
    ]),

    fertilizer: e(FormSection, {}, [
      e('p', { key: 'p2a', className: 'section-title' }, '＜使用条件1（既存施肥）＞'),
      ...form.fertilizers.map((row, index) => e('div', { key: `fert-${index}`, className: 'repeat-block' }, [
        e('p', { key: `ttl-${index}`, className: 'sub-title' }, `肥料 ${index + 1}`),
        e('label', { key: `n1-${index}` }, ['使用肥料名', e('input', { type: 'text', value: row.name, onChange: updateFertilizer(index, 'name') })]),
        e('label', { key: `n2-${index}` }, ['年間施肥量（kg/ha）', e('input', { type: 'number', min: '0', value: row.annualAmount, onChange: updateFertilizer(index, 'annualAmount') })]),
        e('label', { key: `n3-${index}` }, ['肥料中窒素含有率（%N）', e('input', { type: 'number', min: '0', step: '0.01', value: row.nitrogenRate, onChange: updateFertilizer(index, 'nitrogenRate') })]),
        e('label', { key: `n4-${index}` }, ['肥料購買記録', e('input', { type: 'file', onChange: updateFertilizer(index, 'purchaseRecordName') })]),
        e('p', { key: `n5-${index}`, className: 'hint' }, `保存されたファイル名：${row.purchaseRecordName || 'まだありません'}`),
      ])),
      e('button', { key: 'add-fertilizer', type: 'button', className: 'add-btn', onClick: addFertilizer }, '＋ 肥料を追加'),

      e('p', { key: 'p2b', className: 'section-title' }, '＜使用条件3（圃場試験）/影響度算定＞'),
      e('div', { key: 'test-period', className: 'inline-grid' }, [
        e('label', { key: 'n6s' }, ['圃場試験開始日時', e('input', { type: 'datetime-local', value: form.fieldTestStart, onChange: updateField('fieldTestStart') })]),
        e('label', { key: 'n6e' }, ['圃場試験終了日時', e('input', { type: 'datetime-local', value: form.fieldTestEnd, onChange: updateField('fieldTestEnd') })]),
      ]),
      e('p', { key: 'design-title', className: 'sub-title' }, '検証区設計図（4区）'),
      ...[0, 1, 2, 3].map((idx) => e('label', { key: `design-${idx}` }, [`検証区 ${idx + 1}`, e('input', { type: 'file', onChange: updateDesignFile(idx) })])),
      e('p', { key: 'design-hint', className: 'hint' }, `登録済み：${form.fieldTestDesignNames.filter(Boolean).length}/4`),
      e('label', { key: 'n9' }, ['施肥作業回数', e('input', { type: 'number', min: '0', value: form.fertilizerWorkCount, onChange: updateField('fertilizerWorkCount') })]),
      e('label', { key: 'n10' }, ['使用農機種類', e('input', { type: 'text', value: form.machineType, onChange: updateField('machineType') })]),
      e('label', { key: 'n11' }, ['年間燃料使用量', e('input', { type: 'number', min: '0', value: form.annualFuelUsage, onChange: updateField('annualFuelUsage') })]),
    ]),

    bs: e(FormSection, {}, [
      e('p', { key: 'p2c', className: 'section-title' }, '＜使用条件2（BS適格性）＞'),
      ...form.bsMaterials.map((row, index) => e('div', { key: `bsm-${index}`, className: 'repeat-block' }, [
        e('p', { key: `bst-${index}`, className: 'sub-title' }, `BS資材 ${index + 1}`),
        e('label', { key: `b1-${index}` }, ['BS資材名', e('input', { type: 'text', value: row.materialName, onChange: updateBsMaterial(index, 'materialName') })]),
        e('label', { key: `b2-${index}` }, ['ガイドライン準拠証明書', e('input', { type: 'file', onChange: updateBsMaterial(index, 'certificateName') })]),
        e('p', { key: `b2h-${index}`, className: 'hint' }, `保存されたファイル名：${row.certificateName || 'まだありません'}`),
        e('label', { key: `b3-${index}` }, ['日付', e('input', { type: 'datetime-local', value: row.usageDateTime, onChange: updateBsMaterial(index, 'usageDateTime') })]),
        e('label', { key: `b4-${index}` }, ['BS使用方法', e('input', { type: 'text', value: row.usageMethod, onChange: updateBsMaterial(index, 'usageMethod') })]),
        e('label', { key: `b5-${index}` }, ['使用量', e('input', { type: 'number', min: '0', value: row.usageAmount, onChange: updateBsMaterial(index, 'usageAmount') })]),
        e('label', { key: `b6-${index}` }, ['回数', e('input', { type: 'number', min: '0', value: row.usageCount, onChange: updateBsMaterial(index, 'usageCount') })]),
        e('label', { key: `b7-${index}` }, ['希釈倍率', e('input', { type: 'text', value: row.dilutionRate, onChange: updateBsMaterial(index, 'dilutionRate') })]),
      ])),
      e('button', { key: 'add-bs', type: 'button', className: 'add-btn', onClick: addBsMaterial }, '＋ BS資材を追加'),
    ]),

    harvest: e(FormSection, {}, [
      e('p', { key: 'p3a', className: 'section-title' }, '＜施肥データ＞'),
      e('label', { key: 'h1' }, ['慣行施肥量（kg/ha）', e('input', { type: 'number', min: '0', value: form.conventionalFertilizerPerHa, onChange: updateField('conventionalFertilizerPerHa') })]),
      e('label', { key: 'h2' }, ['減肥施肥量（kg/ha）', e('input', { type: 'number', min: '0', value: form.reducedFertilizerPerHa, onChange: updateField('reducedFertilizerPerHa') })]),
      e('label', { key: 'h3' }, ['減肥率（%）', e('input', { type: 'number', min: '0', step: '0.01', value: form.fertilizerReductionRate, onChange: updateField('fertilizerReductionRate') })]),
      e('label', { key: 'h4' }, ['肥料中窒素含有率', e('input', { type: 'number', min: '0', step: '0.01', value: form.firstYearNitrogenRate, onChange: updateField('firstYearNitrogenRate') })]),
      e('p', { key: 'p3b', className: 'section-title' }, '＜収穫量データ＞'),
      e('label', { key: 'h5' }, ['慣行区収穫量', e('input', { type: 'number', min: '0', value: form.conventionalYield, onChange: updateField('conventionalYield') })]),
      e('label', { key: 'h6' }, ['減肥＋BS区収穫量', e('input', { type: 'number', min: '0', value: form.reducedBsYield, onChange: updateField('reducedBsYield') })]),
      e('p', { key: 'p3c', className: 'section-title' }, '＜BS管理＞'),
      e('label', { key: 'h7' }, ['BS使用日', e('input', { type: 'date', value: form.firstYearBsDate, onChange: updateField('firstYearBsDate') })]),
      e('label', { key: 'h8' }, ['使用量・濃度・回数', e('input', { type: 'text', value: form.firstYearBsUsage, onChange: updateField('firstYearBsUsage') })]),
      e('label', { key: 'h9' }, ['生産管理記録', e('input', { type: 'file', onChange: updateField('productionRecordName') })]),
      e('label', { key: 'h11' }, ['JA等の確認書', e('input', { type: 'file', onChange: updateField('jaConfirmationName') })]),
    ]),

    machine: e(FormSection, {}, [
      e('p', { key: 'p4a', className: 'section-title' }, '＜栽培面積/施肥データ/成分データ＞'),
      e('label', { key: 'm1' }, ['BS使用圃場面積（ha）', e('input', { type: 'number', min: '0', step: '0.01', value: form.bsFieldAreaHa, onChange: updateField('bsFieldAreaHa') })]),
      e('label', { key: 'm2' }, ['施肥日', e('input', { type: 'date', value: form.activityFertilizerDate, onChange: updateField('activityFertilizerDate') })]),
      e('label', { key: 'm3' }, ['肥料名', e('input', { type: 'text', value: form.activityFertilizerName, onChange: updateField('activityFertilizerName') })]),
      e('label', { key: 'm4' }, ['使用量（kg）', e('input', { type: 'number', min: '0', value: form.activityFertilizerAmountKg, onChange: updateField('activityFertilizerAmountKg') })]),
      e('label', { key: 'm5' }, ['単位面積当たり施肥量', e('input', { type: 'number', min: '0', value: form.activityFertilizerPerArea, onChange: updateField('activityFertilizerPerArea') })]),
      e('label', { key: 'm6' }, ['肥料中窒素含有率', e('input', { type: 'number', min: '0', step: '0.01', value: form.activityNitrogenRate, onChange: updateField('activityNitrogenRate') })]),
      e('p', { key: 'p4b', className: 'section-title' }, '＜収穫量データ＞'),
      e('label', { key: 'm7' }, ['圃場別年間収穫量', e('input', { type: 'number', min: '0', value: form.fieldYearlyYield, onChange: updateField('fieldYearlyYield') })]),
      e('label', { key: 'm8' }, ['出荷記録', e('input', { type: 'file', onChange: updateField('shippingRecordName') })]),
    ]),

    receipt: e(FormSection, {}, [
      e('p', { key: 'r0', className: 'section-title' }, '補足証憑（任意）'),
      e('label', { key: 'r1' }, ['追加ファイル', e('input', { type: 'file', onChange: updateField('receiptName') })]),
      e('p', { key: 'r2', className: 'hint' }, `保存されたファイル名：${form.receiptName || 'まだありません'}`),
    ]),

    yearly: e(FormSection, {}, [
      e('p', { key: 'p5a', className: 'section-title' }, '＜農機燃料/運搬燃料＞'),
      e('label', { key: 'y1' }, ['施肥作業燃料使用量', e('input', { type: 'number', min: '0', value: form.fertilizingFuelUsage, onChange: updateField('fertilizingFuelUsage') })]),
      e('label', { key: 'y2' }, ['BS散布燃料使用量', e('input', { type: 'number', min: '0', value: form.bsSprayFuelUsage, onChange: updateField('bsSprayFuelUsage') })]),
      e('label', { key: 'y3' }, ['肥料運搬燃料使用量', e('input', { type: 'number', min: '0', value: form.fertilizerTransportFuelUsage, onChange: updateField('fertilizerTransportFuelUsage') })]),
      e('label', { key: 'y4' }, ['BS運搬燃料使用量', e('input', { type: 'number', min: '0', value: form.bsTransportFuelUsage, onChange: updateField('bsTransportFuelUsage') })]),
      e('p', { key: 'p5b', className: 'section-title' }, '＜使用条件4確認/活動量整理＞'),
      e('label', { key: 'y5', className: 'check-label' }, [e('input', { type: 'checkbox', checked: form.cropChanged, onChange: updateField('cropChanged') }), '作物変更有無']),
      e('label', { key: 'y6', className: 'check-label' }, [e('input', { type: 'checkbox', checked: form.cultivationChanged, onChange: updateField('cultivationChanged') }), '栽培方法変更有無']),
      e('label', { key: 'y7' }, ['栽培面積（最終確定値）', e('input', { type: 'number', min: '0', value: form.finalCultivationArea, onChange: updateField('finalCultivationArea') })]),
      e('label', { key: 'y8' }, ['年間施肥量（確定値）', e('input', { type: 'number', min: '0', value: form.finalAnnualFertilizer, onChange: updateField('finalAnnualFertilizer') })]),
      e('label', { key: 'y9' }, ['年間収穫量（確定値）', e('input', { type: 'number', min: '0', value: form.finalAnnualYield, onChange: updateField('finalAnnualYield') })]),
      e('p', { key: 'p5c', className: 'section-title' }, '＜係数＞'),
      e('label', { key: 'y10' }, ['N₂O排出係数（最新値）', e('input', { type: 'number', min: '0', step: '0.0001', value: form.n2oFactorLatest, onChange: updateField('n2oFactorLatest') })]),
      e('label', { key: 'y11' }, ['GWP（最新値）', e('input', { type: 'number', min: '0', step: '0.01', value: form.gwpLatest, onChange: updateField('gwpLatest') })]),
      e('label', { key: 'y12' }, ['燃料排出係数', e('input', { type: 'number', min: '0', step: '0.0001', value: form.fuelFactor, onChange: updateField('fuelFactor') })]),
      e('p', { key: 'p5d', className: 'section-title' }, '＜証憑書類＞'),
      e('label', { key: 'y13' }, ['燃料請求書', e('input', { type: 'file', onChange: updateField('fuelInvoiceName') })]),
      e('label', { key: 'y14' }, ['BSガイドライン証明書', e('input', { type: 'file', onChange: updateField('monitoringBsCertificateName') })]),
      e('label', { key: 'y15' }, ['JA確認書', e('input', { type: 'file', onChange: updateField('monitoringJaConfirmationName') })]),
      e('label', { key: 'y16' }, ['圃場位置図', e('input', { type: 'file', onChange: updateField('monitoringFieldMapName') })]),
      e('section', { key: 'y19', className: 'summary-list', 'aria-live': 'polite' },
        yearSummary.map(([label, value]) => e('article', { key: label, className: 'summary-item' }, [e('p', { key: 1 }, label), e('strong', { key: 2 }, value)]))),
      e('p', { key: 'note', className: 'hint' }, '※算定ロジックはモックのため実装していません。'),
    ]),
  };

  const goPrev = () => {
    if (stepIndex > 0) return setStepIndex(stepIndex - 1);
    if (phaseIndex > 0) {
      const prevPhaseIndex = phaseIndex - 1;
      setPhaseIndex(prevPhaseIndex);
      setStepIndex(phases[prevPhaseIndex].steps.length - 1);
    }
  };

  const goNext = () => {
    if (stepIndex < currentPhase.steps.length - 1) return setStepIndex(stepIndex + 1);
    if (phaseIndex < phases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
      setStepIndex(0);
    }
  };

  return e('div', { className: 'app-shell' }, [
    e('header', { key: 'header', className: 'app-header' }, [
      e('h1', { key: 1 }, '農作業の記録アプリ（モック）'),
      e('p', { key: 2 }, 'デバッグしやすいよう、フェーズ間は自由に移動できます。'),
    ]),
    e('nav', { key: 'phase-nav', className: 'phase-nav', 'aria-label': 'フェーズ一覧' },
      phases.map((phase, index) => e('button', {
        key: phase.id,
        type: 'button',
        className: `phase-chip ${index === phaseIndex ? 'is-active' : ''}`,
        onClick: () => { setPhaseIndex(index); setStepIndex(0); },
      }, `${index + 1}. ${phase.label}`))),
    e('div', { key: 'phase-info', className: 'phase-info' }, [
      e('strong', { key: 'phase-title' }, currentPhase.label),
      e('p', { key: 'step-title' }, `入力項目：${currentStep.label}`),
    ]),
    e('main', { key: 'main', className: 'card' }, [
      e('h2', { key: 'h2' }, currentStep.title),
      e('div', { key: 'content' }, contentByPage[currentStep.id]),
      e('footer', { key: 'f', className: 'footer-actions' }, [
        e('button', { key: 'p', type: 'button', disabled: phaseIndex === 0 && stepIndex === 0, onClick: goPrev }, '前へ'),
        e('button', { key: 'n', type: 'button', disabled: phaseIndex === phases.length - 1 && stepIndex === currentPhase.steps.length - 1, onClick: goNext }, stepIndex === currentPhase.steps.length - 1 ? '次のフェーズへ' : '次へ'),
      ]),
    ]),
  ]);
}

createRoot(document.getElementById('root')).render(e(App));

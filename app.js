import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const e = React.createElement;

const pages = [
  { id: 'field', label: '圃場登録', title: '圃場を登録' },
  { id: 'fertilizer', label: '施肥入力', title: '肥料の記録' },
  { id: 'bs', label: 'BS使用入力', title: 'バイオ炭の記録' },
  { id: 'harvest', label: '収穫量入力', title: '収穫の記録' },
  { id: 'machine', label: '農機作業入力', title: '機械作業の記録' },
  { id: 'receipt', label: '証憑アップロード', title: '証明書類を保存' },
  { id: 'yearly', label: '年間まとめ表示', title: '年間のまとめ' },
];

const initialState = {
  fieldName: '', fieldArea: '', fertilizerType: '', fertilizerAmount: '',
  bsDate: '', bsAmount: '', harvestDate: '', harvestAmount: '',
  machineDate: '', machineTask: '', receiptName: '',
};

function FormSection({ children }) {
  return e('section', { className: 'form-section' }, children);
}

function App() {
  const [activePage, setActivePage] = useState('field');
  const [form, setForm] = useState(initialState);
  const activeIndex = pages.findIndex((p) => p.id === activePage);

  const updateField = (key) => (event) => {
    const value = key === 'receiptName' ? event.target.files?.[0]?.name || '' : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const yearSummary = useMemo(() => [
    ['登録した圃場', form.fieldName || '未入力'],
    ['圃場の広さ', form.fieldArea ? `${form.fieldArea} a` : '未入力'],
    ['肥料の量', form.fertilizerAmount ? `${form.fertilizerAmount} kg` : '未入力'],
    ['バイオ炭の量', form.bsAmount ? `${form.bsAmount} kg` : '未入力'],
    ['収穫量', form.harvestAmount ? `${form.harvestAmount} kg` : '未入力'],
    ['機械作業', form.machineTask || '未入力'],
    ['証明書類', form.receiptName || '未アップロード'],
  ], [form]);

  const contentByPage = {
    field: e(FormSection, {}, [
      e('label', { key: 'f1' }, ['圃場名', e('input', { type: 'text', value: form.fieldName, onChange: updateField('fieldName'), placeholder: '例：西の田んぼ' })]),
      e('label', { key: 'f2' }, ['広さ（a）', e('input', { type: 'number', min: '0', value: form.fieldArea, onChange: updateField('fieldArea'), placeholder: '例：30' })]),
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

  return e('div', { className: 'app-shell' }, [
    e('header', { key: 'header', className: 'app-header' }, [
      e('h1', { key: 1 }, '農作業の記録アプリ（モック）'),
      e('p', { key: 2 }, '1画面ずつ入力できます。難しい言葉は使っていません。'),
    ]),
    e('nav', { key: 'nav', className: 'step-nav', 'aria-label': '入力ステップ' },
      pages.map((page, i) => e('button', {
        key: page.id,
        type: 'button',
        className: `step-chip ${page.id === activePage ? 'is-active' : ''}`,
        onClick: () => setActivePage(page.id),
      }, `${i + 1}. ${page.label}`))),
    e('main', { key: 'main', className: 'card' }, [
      e('h2', { key: 'h2' }, pages[activeIndex].title),
      e('div', { key: 'content' }, contentByPage[activePage]),
      e('footer', { key: 'f', className: 'footer-actions' }, [
        e('button', { key: 'p', type: 'button', disabled: activeIndex === 0, onClick: () => setActivePage(pages[Math.max(activeIndex - 1, 0)].id) }, '前へ'),
        e('button', { key: 'n', type: 'button', disabled: activeIndex === pages.length - 1, onClick: () => setActivePage(pages[Math.min(activeIndex + 1, pages.length - 1)].id) }, '次へ'),
      ]),
    ]),
  ]);
}

createRoot(document.getElementById('root')).render(e(App));

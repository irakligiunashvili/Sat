import { useState } from 'react'
import { categories, type CategoryId } from '../types'
import { categoryCover } from '../data'
import { useSat } from '../store'

export function EasySelling({ currency, onBack, onDone }: { currency: string; onBack: () => void; onDone: () => void }) {
  const { addProduct } = useSat()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<CategoryId>('wine')
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('bottle')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const titles = ['What are you selling?', 'What do you call it?', 'How do you sell it?', 'What’s the price?', 'Ready to put it in your shop?']
  const amount = Number(price.replace(',', '.'))
  function next() {
    if (step === 1 && !name.trim()) { setError('Give your product a name.'); return }
    if (step === 3 && (!price.trim() || !Number.isFinite(amount) || amount <= 0)) { setError('Enter a price greater than zero.'); return }
    setError('')
    setStep(step + 1)
  }
  return <main className="mode-choice selling-steps">
    <header className="mode-choice-head">
      <button type="button" className="text-btn" onClick={() => { setError(''); step ? setStep(step - 1) : onBack() }}>Back</button>
      <span>Step {step + 1} of 5</span>
    </header>
    <section className="mode-choice-body">
      <h1>{titles[step]}</h1>
      {step === 0 && <div className="selling-options">{categories.map(cat => <button type="button" key={cat.id} onClick={() => {
        setCategory(cat.id); setName(''); setUnit(cat.id === 'wine' ? 'bottle' : cat.id === 'bread' ? 'loaf' : ['honey', 'preserves'].includes(cat.id) ? 'jar' : 'kg'); setStep(1)
      }}>{cat.label}</button>)}</div>}
      {step === 1 && <><p>A simple name, like “Homemade red wine”.</p><label className="field"><span>Product name</span><input value={name} maxLength={80} onChange={e => setName(e.target.value)} placeholder="What do you call it?" /></label></>}
      {step === 2 && <div className="selling-options">{['bottle', 'jar', 'kg', 'loaf', 'basket', 'piece', 'bag'].map(value => <button type="button" aria-pressed={unit === value} key={value} onClick={() => { setUnit(value); setStep(3) }}>Per {value}</button>)}</div>}
      {step === 3 && <><p>Price for one {unit}, in {currency}.</p><label className="field"><span>Price ({currency})</span><input inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" /></label></>}
      {step === 4 && <div className="selling-review"><h2>{name.trim()}</h2><p>{categories.find(c => c.id === category)?.label}</p><strong>{amount.toFixed(2)} {currency} / {unit}</strong><p>Your listing is saved on this phone.</p></div>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
    <footer className="farmer-welcome-footer">
      {(step === 1 || step === 3) && <button type="button" className="btn btn-primary" onClick={next}>Continue</button>}
      {step === 4 && <button type="button" className="btn btn-primary" onClick={() => {
        addProduct({ name: name.trim(), category, unit, price: amount, detail: 'Available from our place', image: categoryCover[category] }); onDone()
      }}>Add to my shop</button>}
    </footer>
  </main>
}

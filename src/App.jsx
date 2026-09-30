import { useEffect, useReducer, useRef, useState } from 'react'
import { Camera, Film, Music2, CalendarDays, Search, Play, Pause, Rewind, FastForward, SkipBack, SkipForward, Volume2, X, Sun, Moon, Tv, Mic, Clapperboard, Users, Database } from 'lucide-react'

const PHOTOS = [
  { id: 1, era: '80s', title: 'Verano en la playa', year: 1986, place: 'Viña del Mar', from: '#F4B251', to: '#E05A47', note: 'Toalla a rayas y radio a pilas. El mejor verano.' },
  { id: 2, era: '80s', title: 'Sala de estar', year: 1984, place: 'Casa de los abuelos', from: '#C23B22', to: '#6b2a1d', note: 'El televisor de madera mandaba en la casa.' },
  { id: 3, era: '90s', title: 'Cumpleaños número 8', year: 1993, place: 'Patio trasero', from: '#3A8B88', to: '#1f4d4b', note: 'Torta de chocolate y globos que nunca duraron.' },
  { id: 4, era: '90s', title: 'Arcade del barrio', year: 1996, place: 'Galería Centro', from: '#6b3fa0', to: '#E05A47', note: 'Una ficha, tres vidas, cero tarea.' },
  { id: 5, era: 'familia', title: 'Foto de los primos', year: 1991, place: 'Parcela del sur', from: '#F4B251', to: '#C23B22', note: 'Todos mirando a cámara menos el tío Lucho.' },
  { id: 6, era: 'familia', title: 'Navidad en casa', year: 1989, place: 'Comedor', from: '#3A8B88', to: '#C23B22', note: 'El árbol con luces que parpadeaban a su ritmo.' },
  { id: 7, era: 'lugares', title: 'Plaza de Armas', year: 1994, place: 'Los Ángeles, Chile', from: '#E05A47', to: '#3A8B88', note: 'Domingo de helado y palomas.' },
  { id: 8, era: 'lugares', title: 'Videoclub Estrella', year: 1998, place: 'Esquina de Colo Colo', from: '#1A1817', to: '#C23B22', note: 'Se arrendaba por 24 horas. Rebobinar era ley.' },
]
const ERAS = [['todo', 'Todas'], ['80s', 'Años 80'], ['90s', 'Años 90'], ['familia', 'Fotos familiares'], ['lugares', 'Lugares']]

const VIDEOS = [
  { id: 'v1', kind: 'personal', title: 'Campamento 1992', desc: 'Fogata, guitarra y linternas.', dur: 94, color: '#3A8B88' },
  { id: 'v2', kind: 'personal', title: 'Matrimonio de la tía', desc: 'Baile de los novios en cámara lenta.', dur: 132, color: '#E05A47' },
  { id: 'v3', kind: 'personal', title: 'Vacaciones en el sur', desc: 'Lago, lluvia y empanadas.', dur: 76, color: '#F4B251' },
  { id: 'v4', kind: 'trailer', title: 'Cazadores de Sombras (1987)', desc: 'Tráiler de acción y ciencia ficción.', dur: 120, color: '#C23B22' },
  { id: 'v5', kind: 'trailer', title: 'Noche en el Motel (1991)', desc: 'Suspenso de medianoche.', dur: 105, color: '#6b3fa0' },
  { id: 'v6', kind: 'trailer', title: 'El Último Videoclub (1995)', desc: 'Comedia sobre la era del VHS.', dur: 88, color: '#3A8B88' },
]

const TRACKS = [
  { id: 't1', title: 'Neón en la Avenida', artist: 'Kaleidoscopio 84', dur: 214 },
  { id: 't2', title: 'Domingo de Walkman', artist: 'Los Cassettes', dur: 187 },
  { id: 't3', title: 'Autopista Turquesa', artist: 'Synthia', dur: 243 },
  { id: 't4', title: 'Llamada a las 3 AM', artist: 'Teléfono Rojo', dur: 201 },
  { id: 't5', title: 'Verano Analógico', artist: 'Kaleidoscopio 84', dur: 176 },
]

const EFEMERIDES = {
  '09-30': [
    { y: 1960, t: 'Se estrena Los Picapiedra en la televisión de Estados Unidos.', k: 'tv' },
    { y: 1955, t: 'Muere el actor James Dean en un accidente de auto a los 24 años.', k: 'cine' },
    { y: 1927, t: 'Babe Ruth conecta su jonrón número 60 de la temporada.', k: 'deporte' },
  ],
  '07-03': [
    { y: 1985, t: 'Llega a los cines Volver al Futuro.', k: 'cine' },
    { y: 1969, t: 'Muere Brian Jones, fundador de The Rolling Stones.', k: 'música' },
  ],
  '06-11': [{ y: 1982, t: 'Se estrena E.T., el extraterrestre en Estados Unidos.', k: 'cine' }],
  '06-20': [{ y: 1975, t: 'Se estrena Tiburón, el primer gran éxito de taquilla del verano.', k: 'cine' }],
  '05-25': [{ y: 1977, t: 'Se estrena La Guerra de las Galaxias en los cines de Estados Unidos.', k: 'cine' }],
  '11-20': [{ y: 1985, t: 'Microsoft lanza Windows 1.0.', k: 'tecnología' }],
  '11-22': [{ y: 1995, t: 'Toy Story se estrena como la primera película animada totalmente por computador.', k: 'cine' }],
}

const Pacman = ({ size = 28 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true"><path d="M16 16 L28 8 A14 14 0 1 0 28 24 Z" fill="#F4B251" stroke="#2A211C" strokeWidth="1.5" /><circle cx="17" cy="9" r="2" fill="#2A211C" /></svg>
)
const CassetteIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="6" width="28" height="20" rx="3" /><circle cx="11" cy="15" r="3" /><circle cx="21" cy="15" r="3" /><path d="M9 22h14l-2-4H11z" /></svg>
)
const VhsIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="7" width="28" height="18" rx="2" /><rect x="8" y="11" width="16" height="6" rx="1" /><circle cx="11" cy="21" r="1.5" /><circle cx="21" cy="21" r="1.5" /></svg>
)
const TABS = [
  { id: 'quienes', label: 'Quiénes Somos', Icon: Users, sub: 'Bienvenida' },
  { id: 'fotos', label: 'Fotos', Icon: Camera, sub: 'Cámara' },
  { id: 'musica', label: 'Música', Icon: Mic, Icon2: CassetteIcon, sub: 'Micrófono y cassette' },
  { id: 'videos', label: 'Videos', Icon: VhsIcon, Icon2: Clapperboard, sub: 'VHS y cine' },
  { id: 'efemerides', label: 'Datos', Icon: Database, sub: 'Efemérides' },
]
const today = new Date()
const initial = {
  tab: 'quienes', query: '', era: 'todo', kind: 'personal', crt: true, dark: true,
  track: 0, playing: false, pos: 0, volume: 70,
  video: null, vPlaying: false, vPos: 0,
  photo: null,
  date: `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
}
function reducer(s, a) {
  switch (a.type) {
    case 'tab': return { ...s, tab: a.v }
    case 'set': return { ...s, ...a.v }
    case 'tick': return { ...s, pos: Math.min(s.pos + 1, TRACKS[s.track].dur) }
    case 'vtick': return { ...s, vPos: Math.min(s.vPos + 1, VIDEOS.find(v => v.id === s.video)?.dur ?? 0) }
    case 'pickTrack': return { ...s, track: a.v, pos: 0, playing: true }
    case 'next': { const t = (s.track + a.d + TRACKS.length) % TRACKS.length; return { ...s, track: t, pos: 0 } }
    default: return s
  }
}
const fmt = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`

function Reel({ spin }) {
  return (
    <svg viewBox="0 0 60 60" className={`h-14 w-14 ${spin ? 'reel' : ''}`} aria-hidden="true">
      <circle cx="30" cy="30" r="28" fill="#1A1817" stroke="#F4B251" strokeWidth="2" />
      <circle cx="30" cy="30" r="10" fill="#F5EFEB" />
      {[0, 60, 120, 180, 240, 300].map(r => <rect key={r} x="28" y="3" width="4" height="13" fill="#F5EFEB" transform={`rotate(${r} 30 30)`} />)}
    </svg>
  )
}

export default function App() {
  const [s, d] = useReducer(reducer, initial)
  const searchRef = useRef(null)
  const [chosenTrack, chosenVideo] = [TRACKS[s.track], VIDEOS.find(v => v.id === s.video)]

  useEffect(() => {
    if (!s.playing) return
    const i = setInterval(() => d({ type: 'tick' }), 1000)
    return () => clearInterval(i)
  }, [s.playing])
  useEffect(() => { if (s.playing && s.pos >= chosenTrack.dur) d({ type: 'next', d: 1 }) }, [s.pos, s.playing, chosenTrack.dur])
  useEffect(() => {
    if (!s.vPlaying) return
    const i = setInterval(() => d({ type: 'vtick' }), 1000)
    return () => clearInterval(i)
  }, [s.vPlaying])
  useEffect(() => {
    const k = e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape') d({ type: 'set', v: { photo: null } })
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const q = s.query.trim().toLowerCase()
  const photos = PHOTOS.filter(p => (s.era === 'todo' || p.era === s.era) && (!q || `${p.title} ${p.place} ${p.year}`.toLowerCase().includes(q)))
  const videos = VIDEOS.filter(v => v.kind === s.kind && (!q || v.title.toLowerCase().includes(q)))
  const tracks = TRACKS.map((t, i) => ({ ...t, i })).filter(t => !q || `${t.title} ${t.artist}`.toLowerCase().includes(q))
  const events = EFEMERIDES[s.date] ?? []
  const onTabKey = e => {
    const i = TABS.findIndex(t => t.id === s.tab)
    if (e.key === 'ArrowRight') d({ type: 'tab', v: TABS[(i + 1) % TABS.length].id })
    if (e.key === 'ArrowLeft') d({ type: 'tab', v: TABS[(i + TABS.length - 1) % TABS.length].id })
  }
  const set = v => d({ type: 'set', v })
  const mover = delta => set({ vPos: Math.max(0, Math.min((chosenVideo?.dur ?? 0), s.vPos + delta)) })
  const Ctl = ({ label, onClick, children, big }) => (
    <button aria-label={label} title={label} onClick={onClick} className={`btn neo grid place-items-center rounded-full ${big ? 'h-14 w-14 text-terracota' : 'h-11 w-11'}`}>{children}</button>
  )

  return (
    <div className={s.dark ? 'dark' : ''}>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <svg className="pointer-events-none absolute inset-x-0 top-0 h-72 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
          {['#C23B22','#E05A47','#F4B251','#6FA35A','#3A8B88','#6b3fa0'].map((c, k) => <path key={c} d={`M-50 ${170 + k * 18} Q600 ${-60 + k * 18} 1250 ${170 + k * 18}`} stroke={c} strokeWidth="18" fill="none" />)}
        </svg>
        <div className="relative mx-auto my-6 max-w-6xl overflow-hidden rounded-2xl border-4 border-[#2A211C] bg-[var(--bg)] shadow-[10px_10px_0_rgba(0,0,0,.45)] sm:my-10">
          <header>
            <div className="flex items-center gap-2 border-b-4 border-[#2A211C] bg-mostaza px-3 py-2 text-[#2A211C]">
              <button aria-label="Borrar búsqueda" onClick={() => set({ query: '' })} className="btn h-4 w-4 rounded-full border-2 border-[#2A211C] bg-[#C23B22] sm:h-5 sm:w-5" />
              <button aria-label="Cambiar tema claro u oscuro" onClick={() => set({ dark: !s.dark })} className="btn h-4 w-4 rounded-full border-2 border-[#2A211C] bg-[#6FA35A] sm:h-5 sm:w-5" />
              <button aria-label="Activar o quitar efecto CRT" onClick={() => set({ crt: !s.crt })} className="btn h-4 w-4 rounded-full border-2 border-[#2A211C] bg-[#3A6FD8] sm:h-5 sm:w-5" />
              <h1 className="flex-1 text-center font-display text-lg font-black sm:text-2xl">RETRO-NET.EXE</h1>
              <span className="font-lcd text-lg">LIVE 1995</span>
            </div>
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
              <Pacman />
              <label className="neo-in flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <Search size={16} aria-hidden="true" />
                <input ref={searchRef} value={s.query} onChange={e => set({ query: e.target.value })} placeholder="Buscar en el archivo…" aria-label="Buscar en el archivo" className="w-full bg-transparent font-type text-sm outline-none placeholder:text-[var(--muted)]" />
                <kbd className="rounded border border-[var(--line)] px-1.5 font-lcd text-base text-[var(--muted)]">/</kbd>
              </label>
            </div>
            <nav className="px-4 py-3">
              <div role="tablist" aria-label="Secciones" onKeyDown={onTabKey} className="neo-in flex gap-2 overflow-x-auto rounded-xl p-2">
                {TABS.map(({ id, label, Icon, Icon2 }) => (
                  <button key={id} role="tab" id={`tab-${id}`} aria-selected={s.tab === id} aria-controls={`panel-${id}`} tabIndex={s.tab === id ? 0 : -1} onClick={() => d({ type: 'tab', v: id })}
                    className={`btn flex min-w-[92px] shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs ${s.tab === id ? 'bg-terracota text-white shadow-md' : 'neo'}`}>
                    <span className="flex gap-1"><Icon size={22} aria-hidden="true" />{Icon2 && <Icon2 size={22} aria-hidden="true" />}</span>{label}
                  </button>
                ))}
              </div>
            </nav>
          </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          {s.tab === 'quienes' && (
            <section role="tabpanel" id="panel-quienes" aria-labelledby="tab-quienes">
              <h2 className="font-display text-4xl font-black sm:text-5xl">Quiénes somos</h2>
              <div className="mt-2 h-2 w-40 stripes" aria-hidden="true" />
              <p className="mt-5 max-w-2xl leading-relaxed">Somos un archivo vivo de cultura pop: fotos de familia, cintas caseras, tráilers de videoclub y canciones que sonaban en la radio. Lo guardamos todo en un solo lugar para que puedas abrirlo, escucharlo y compartirlo cuando quieras.</p>
              <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[['fotos', Camera, 'Fotos', `${PHOTOS.length} recuerdos`], ['musica', Mic, 'Música', `${TRACKS.length} canciones`], ['videos', VhsIcon, 'Videos', `${VIDEOS.length} cintas`], ['efemerides', Database, 'Datos', `${Object.keys(EFEMERIDES).length} fechas`]].map(([id, Icon, l, n]) => (
                  <li key={id}><button onClick={() => d({ type: 'tab', v: id })} className="btn neo flex w-full flex-col items-center gap-2 rounded-2xl p-5 hover:text-terracota"><Icon size={40} aria-hidden="true" /><span className="font-display text-lg font-bold">{l}</span><span className="font-lcd text-xl text-teal">{n}</span></button></li>
                ))}
              </ul>
            </section>
          )}

          {s.tab === 'fotos' && (
            <section role="tabpanel" id="panel-fotos" aria-labelledby="tab-fotos">
              <h2 className="mb-1 font-display text-3xl font-black">Álbum de fotos</h2>
              <p className="mb-5 text-[var(--muted)]">Diapositivas y polaroids revelados a mano.</p>
              <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por época">
                {ERAS.map(([id, l]) => (
                  <button key={id} aria-pressed={s.era === id} onClick={() => set({ era: id })} className={`btn rounded-full px-4 py-1.5 text-sm ${s.era === id ? 'bg-mostaza text-[#1A1817] shadow-inner' : 'neo'}`}>{l}</button>
                ))}
              </div>
              {photos.length === 0 && <p className="neo-in rounded-xl p-6 text-center">No hay fotos con ese filtro. Prueba otra época o borra la búsqueda.</p>}
              <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {photos.map((p, i) => (
                  <li key={p.id}>
                    <button onClick={() => set({ photo: p })} aria-label={`Abrir foto: ${p.title}, ${p.year}`} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
                      className="btn block w-full bg-[#FBF7F3] p-3 pb-10 text-left text-[#2A211C] shadow-[0_8px_22px_rgba(0,0,0,.45)] transition hover:!rotate-0 hover:scale-[1.03]">
                      <div className="grid aspect-square place-items-center" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}>
                        <Camera size={40} className="text-white/70" aria-hidden="true" />
                      </div>
                      <p className="mt-3 font-type text-sm">{p.title}</p>
                      <p className="font-lcd text-lg text-[#7A6A60]">{p.year}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {s.tab === 'videos' && (
            <section role="tabpanel" id="panel-videos" aria-labelledby="tab-videos">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-3 font-display text-3xl font-black">Videoteca <VhsIcon /><Clapperboard aria-hidden="true" /></h2>
                  <p className="text-[var(--muted)]">Elige un estuche y ponlo en el reproductor.</p>
                </div>
                <button role="switch" aria-checked={s.crt} onClick={() => set({ crt: !s.crt })} className="btn neo flex items-center gap-2 rounded-full px-4 py-2 text-sm"><Tv size={16} aria-hidden="true" />Efecto CRT: {s.crt ? 'sí' : 'no'}</button>
              </div>
              <div className="neo-in mb-6 inline-flex rounded-xl p-1" role="group" aria-label="Tipo de video">
                {[['personal', 'Videos personales'], ['trailer', 'Tráilers antiguos']].map(([k, l]) => (
                  <button key={k} aria-pressed={s.kind === k} onClick={() => set({ kind: k })} className={`rounded-lg px-4 py-2 text-sm ${s.kind === k ? 'bg-teal text-white' : ''}`}>{l}</button>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <div className="neo rounded-2xl p-4">
                  <div className={`relative grid aspect-video place-items-center overflow-hidden rounded-xl border-4 border-[#0d0c0b] ${s.crt ? 'scan' : ''}`} style={{ background: chosenVideo ? `radial-gradient(circle at 50% 40%, ${chosenVideo.color}, #0d0c0b 85%)` : '#0d0c0b' }}>
                    {chosenVideo ? (
                      <div className="text-center text-white">
                        <p className="font-lcd text-3xl">{s.vPlaying ? '▶ PLAY' : '❚❚ PAUSA'}</p>
                        <p className="font-display text-xl">{chosenVideo.title}</p>
                      </div>
                    ) : <p className="font-lcd text-2xl text-white/70">INSERTA UNA CINTA</p>}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full neo-in" role="progressbar" aria-valuemin={0} aria-valuemax={chosenVideo?.dur ?? 0} aria-valuenow={s.vPos} aria-label="Progreso del video">
                    <div className="h-full bg-terracota" style={{ width: `${chosenVideo ? (s.vPos / chosenVideo.dur) * 100 : 0}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-lcd text-xl">
                    <span>{fmt(s.vPos)}</span><span>{fmt(chosenVideo?.dur ?? 0)}</span>
                  </div>
                  <div className="mt-2 flex justify-center gap-3">
                    <Ctl label="Retroceder 10 segundos" onClick={() => mover(-10)}><Rewind size={18} /></Ctl>
                    <Ctl big label={s.vPlaying ? 'Pausar' : 'Reproducir'} onClick={() => chosenVideo && set({ vPlaying: !s.vPlaying })}>{s.vPlaying ? <Pause size={22} /> : <Play size={22} />}</Ctl>
                    <Ctl label="Adelantar 10 segundos" onClick={() => mover(10)}><FastForward size={18} /></Ctl>
                  </div>
                </div>
                <ul className="grid content-start gap-4">
                  {videos.length === 0 && <li className="neo-in rounded-xl p-4">Sin resultados para esa búsqueda.</li>}
                  {videos.map(v => (
                    <li key={v.id}>
                      <button onClick={() => set({ video: v.id, vPos: 0, vPlaying: true })} aria-pressed={s.video === v.id} className={`btn neo flex w-full overflow-hidden rounded-xl text-left ${s.video === v.id ? 'ring-2 ring-mostaza' : ''}`}>
                        <div className="w-5 shrink-0" style={{ background: v.color }} aria-hidden="true" />
                        <div className="flex-1 p-3">
                          <p className="font-display text-lg font-bold leading-tight">{v.title}</p>
                          <p className="text-sm text-[var(--muted)]">{v.desc}</p>
                          <p className="mt-1 font-lcd text-lg text-teal">VHS · {fmt(v.dur)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {s.tab === 'musica' && (
            <section role="tabpanel" id="panel-musica" aria-labelledby="tab-musica">
              <h2 className="mb-1 flex items-center gap-3 font-display text-3xl font-black">Mixtape <Mic aria-hidden="true" /><CassetteIcon /></h2>
              <p className="mb-5 text-[var(--muted)]">La cinta gira mientras suena la música.</p>
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="neo overflow-hidden rounded-2xl">
                  <div className="stripes h-2" aria-hidden="true" />
                  <div className="p-5">
                    <div className="neo-in flex items-center justify-around rounded-xl p-4">
                      <Reel spin={s.playing} /><div className="neo-in w-24 rounded p-2 text-center font-lcd text-xl text-teal">{fmt(s.pos)}</div><Reel spin={s.playing} />
                    </div>
                    <p className="mt-4 font-display text-2xl font-black" aria-live="polite">{chosenTrack.title}</p>
                    <p className="text-[var(--muted)]">{chosenTrack.artist}</p>
                    <input type="range" min="0" max={chosenTrack.dur} value={s.pos} onChange={e => set({ pos: +e.target.value })} aria-label="Posición de la canción" className="mt-3 w-full" />
                    <div className="flex justify-between font-lcd text-xl"><span>{fmt(s.pos)}</span><span>{fmt(chosenTrack.dur)}</span></div>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <Ctl label="Canción anterior" onClick={() => d({ type: 'next', d: -1 })}><SkipBack size={18} /></Ctl>
                      <Ctl big label={s.playing ? 'Pausar' : 'Reproducir'} onClick={() => set({ playing: !s.playing })}>{s.playing ? <Pause size={22} /> : <Play size={22} />}</Ctl>
                      <Ctl label="Canción siguiente" onClick={() => d({ type: 'next', d: 1 })}><SkipForward size={18} /></Ctl>
                    </div>
                    <label className="mt-4 flex items-center gap-3"><Volume2 size={18} aria-hidden="true" /><input type="range" min="0" max="100" value={s.volume} onChange={e => set({ volume: +e.target.value })} aria-label="Volumen" className="w-full" /><span className="w-10 font-lcd text-xl">{s.volume}</span></label>
                  </div>
                </div>
                <ol className="grid content-start gap-3" aria-label="Lista de reproducción">
                  {tracks.length === 0 && <li className="neo-in rounded-xl p-4">Sin resultados para esa búsqueda.</li>}
                  {tracks.map(t => (
                    <li key={t.id}>
                      <button onClick={() => d({ type: 'pickTrack', v: t.i })} aria-current={s.track === t.i} className={`btn neo flex w-full items-center gap-3 rounded-xl p-3 text-left ${s.track === t.i ? 'ring-2 ring-terracota' : ''}`}>
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-mostaza text-[#1A1817]">{s.track === t.i && s.playing ? <Pause size={15} /> : <Play size={15} />}</span>
                        <span className="flex-1"><span className="block">{t.title}</span><span className="block text-sm text-[var(--muted)]">{t.artist}</span></span>
                        <span className="font-lcd text-xl">{fmt(t.dur)}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {s.tab === 'efemerides' && (
            <section role="tabpanel" id="panel-efemerides" aria-labelledby="tab-efemerides">
              <h2 className="mb-1 font-display text-3xl font-black">Un día como hoy</h2>
              <p className="mb-5 text-[var(--muted)]">Elige una fecha y revisa qué pasó.</p>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <label className="text-sm" htmlFor="fecha">Fecha:</label>
                <select id="fecha" value={s.date} onChange={e => set({ date: e.target.value })} className="neo-in rounded-lg bg-[var(--bg)] px-3 py-2">
                  {[...new Set([s.date, ...Object.keys(EFEMERIDES)])].sort().map(k => <option key={k} value={k}>{k.split('-').reverse().join('/')}</option>)}
                </select>
              </div>
              {events.length === 0 ? (
                <p className="neo-in rounded-xl p-6">No hay registros para esta fecha. Prueba con otra del selector.</p>
              ) : (
                <ol className="relative ml-3 border-l-4 border-terracota pl-6">
                  {[...events].sort((a, b) => b.y - a.y).map(e => (
                    <li key={e.t} className="relative mb-6">
                      <span className="absolute -left-[38px] top-2 h-4 w-4 rounded-full border-4 border-[var(--bg)] bg-mostaza" aria-hidden="true" />
                      <div className="neo rounded-xl p-4">
                        <p className="font-lcd text-3xl text-terracota">{e.y}</p>
                        <p>{e.t}</p>
                        <span className="mt-2 inline-block rounded-full bg-teal px-3 py-0.5 text-xs text-white">{e.k}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}
        </main>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur" role="region" aria-label="Mini reproductor">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <button aria-label={s.playing ? 'Pausar música' : 'Reproducir música'} onClick={() => set({ playing: !s.playing })} className="btn neo grid h-10 w-10 place-items-center rounded-full text-terracota">{s.playing ? <Pause size={18} /> : <Play size={18} />}</button>
            <p className="min-w-0 flex-1 truncate text-sm">{chosenTrack.title} <span className="text-[var(--muted)]">· {chosenTrack.artist}</span></p>
            <span className="font-lcd text-xl">{fmt(s.pos)}</span>
          </div>
        </div>

        {s.photo && (
          <div role="dialog" aria-modal="true" aria-label={s.photo.title} className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4" onClick={() => set({ photo: null })}>
            <div className="max-h-full w-full max-w-md overflow-auto bg-[#FBF7F3] p-4 text-[#2A211C]" onClick={e => e.stopPropagation()}>
              <div className="relative grid aspect-square place-items-center" style={{ background: `linear-gradient(135deg, ${s.photo.from}, ${s.photo.to})` }}>
                <Camera size={64} className="text-white/70" aria-hidden="true" />
                <button autoFocus aria-label="Cerrar" onClick={() => set({ photo: null })} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"><X size={18} /></button>
              </div>
              <h3 className="mt-4 font-display text-2xl font-black">{s.photo.title}</h3>
              <p className="font-lcd text-xl text-[#C23B22]">{s.photo.year} · {s.photo.place}</p>
              <p className="mt-2 font-type">{s.photo.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

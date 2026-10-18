import { useEffect, useReducer, useRef } from 'react'
import { Camera, Film, Music2, Search, Play, Pause, Rewind, FastForward, SkipBack, SkipForward, Volume2, X, Sun, Moon, Tv, Mic, Clapperboard, Users, Database, Backpack } from 'lucide-react'
import { REAL_PHOTOS, EXPEDITIONS } from './archivo.js'

/* ===================== DATOS DE PRUEBA ===================== */
const PHOTOS = [
  ...REAL_PHOTOS,
  { id: 1, era: '80s', title: 'Verano en la playa', year: 1986, place: 'Viña del Mar', from: '#F4B251', to: '#E05A47', note: 'Toalla a rayas y radio a pilas. El mejor verano.' },
  { id: 2, era: '80s', title: 'Sala de estar', year: 1984, place: 'Casa de los abuelos', from: '#C23B22', to: '#6b2a1d', note: 'El televisor de madera mandaba en la casa.' },
  { id: 3, era: '90s', title: 'Cumpleaños número 8', year: 1993, place: 'Patio trasero', from: '#3A8B88', to: '#1f4d4b', note: 'Torta de chocolate y globos que nunca duraron.' },
  { id: 4, era: '90s', title: 'Arcade del barrio', year: 1996, place: 'Galería Centro', from: '#6b3fa0', to: '#E05A47', note: 'Una ficha, tres vidas, cero tarea.' },
  { id: 5, era: 'familia', title: 'Foto de los primos', year: 1991, place: 'Parcela del sur', from: '#F4B251', to: '#C23B22', note: 'Todos mirando a cámara menos el tío Lucho.' },
  { id: 6, era: 'familia', title: 'Navidad en casa', year: 1989, place: 'Comedor', from: '#3A8B88', to: '#C23B22', note: 'El árbol con luces que parpadeaban a su ritmo.' },
  { id: 7, era: 'lugares', title: 'Plaza de Armas', year: 1994, place: 'Los Ángeles, Chile', from: '#E05A47', to: '#3A8B88', note: 'Domingo de helado y palomas.' },
  { id: 8, era: 'lugares', title: 'Videoclub Estrella', year: 1998, place: 'Esquina de Colo Colo', from: '#1A1817', to: '#C23B22', note: 'Se arrendaba por 24 horas. Rebobinar era ley.' },
]
const ERAS = [['todo', 'Todas'], ['2024', '2024'], ['2022', '2022'], ['2021', '2021'], ['80s', 'Años 80'], ['90s', 'Años 90'], ['familia', 'Fotos familiares'], ['lugares', 'Lugares']]
const PHOTO_BY_ID = Object.fromEntries(REAL_PHOTOS.map(p => [p.id, p]))
const VIDEOS = [
  { id: 'sv0', kind: 'personal', title: "Selfie en la plaza", desc: "SEL22 · 11 feb 2024", dur: 43, color: '#3A8B88', src: '/media/sel22/videos/20240211_171709.mp4', poster: '/media/sel22/posters/20240211_171709.jpg' },
  { id: 'sv1', kind: 'personal', title: "Selfie con chaqueta", desc: "SEL22 · 11 feb 2024", dur: 22, color: '#3A8B88', src: '/media/sel22/videos/20240211_194314.mp4', poster: '/media/sel22/posters/20240211_194314.jpg' },
  { id: 'sv2', kind: 'personal', title: "El río turquesa", desc: "SEL22 · 12 feb 2024", dur: 13, color: '#3A8B88', src: '/media/sel22/videos/20240212_124132.mp4', poster: '/media/sel22/posters/20240212_124132.jpg' },
  { id: 'sv3', kind: 'personal', title: "Rocas junto al río", desc: "SEL22 · 12 feb 2024", dur: 8, color: '#3A8B88', src: '/media/sel22/videos/20240212_124154.mp4', poster: '/media/sel22/posters/20240212_124154.jpg' },
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

/* ===================== ÍCONOS RETRO ===================== */
const Pacman = ({ size = 30 }) => <img src="/gifs/pacman.gif" width={size} height={size} alt="" aria-hidden="true" />
const StaticGif = ({ on, soft }) => (
  <img src="/gifs/static.gif" alt="" aria-hidden="true" style={{ imageRendering: 'pixelated' }} className={`pointer-events-none absolute inset-0 z-[5] h-full w-full rounded-[inherit] object-cover mix-blend-screen transition-opacity duration-150 ${on ? (soft ? 'opacity-30' : 'opacity-90') : 'opacity-0'}`} />
)
const CassetteIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="6" width="28" height="20" rx="3" /><circle cx="11" cy="15" r="3" /><circle cx="21" cy="15" r="3" /><path d="M9 22h14l-2-4H11z" /></svg>
)
const VhsIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="7" width="28" height="18" rx="2" /><rect x="8" y="11" width="16" height="6" rx="1" /><circle cx="11" cy="21" r="1.5" /><circle cx="21" cy="21" r="1.5" /></svg>
)
const Eq = ({ on }) => <img src={on ? '/gifs/eq.gif' : '/gifs/eq-still.png'} width="48" height="28" alt="" aria-hidden="true" />
const Reel = ({ spin }) => <img src={spin ? '/gifs/reel.gif' : '/gifs/reel-still.png'} className="h-14 w-14" alt="" aria-hidden="true" />

/* ===================== ESTADO ===================== */
const TABS = [
  { id: 'quienes', label: 'Quiénes Somos', Icon: Users },
  { id: 'fotos', label: 'Fotos', Icon: Camera },
  { id: 'ruta', label: 'Ruta', Icon: Backpack },
  { id: 'musica', label: 'Música', Icon: Mic, Icon2: CassetteIcon },
  { id: 'videos', label: 'Videos', Icon: VhsIcon, Icon2: Clapperboard },
  { id: 'efemerides', label: 'Datos', Icon: Database },
]
const now = new Date()
const initial = {
  tab: 'quienes', exp: EXPEDITIONS[0].id, query: '', era: 'todo', kind: 'personal', crt: true, dark: true, burst: false,
  track: 0, playing: false, pos: 0, volume: 70, video: null, vPlaying: false, vPos: 0, photo: null,
  date: `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
}
function reducer(s, a) {
  switch (a.type) {
    case 'tab': return { ...s, tab: a.v }
    case 'set': return { ...s, ...a.v }
    case 'tick': return { ...s, pos: Math.min(s.pos + 1, TRACKS[s.track].dur) }
    case 'vtick': return { ...s, vPos: Math.min(s.vPos + 1, VIDEOS.find(v => v.id === s.video)?.dur ?? 0) }
    case 'pickTrack': return { ...s, track: a.v, pos: 0, playing: true }
    case 'next': return { ...s, track: (s.track + a.d + TRACKS.length) % TRACKS.length, pos: 0 }
    default: return s
  }
}
const fmt = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`

export default function App() {
  const [s, d] = useReducer(reducer, initial)
  const searchRef = useRef(null)
  const videoRef = useRef(null)
  const set = v => d({ type: 'set', v })
  const tr = TRACKS[s.track]
  const cv = VIDEOS.find(v => v.id === s.video)

  useEffect(() => { if (!s.playing) return; const i = setInterval(() => d({ type: 'tick' }), 1000); return () => clearInterval(i) }, [s.playing])
  useEffect(() => { if (s.playing && s.pos >= tr.dur) d({ type: 'next', d: 1 }) }, [s.pos, s.playing, tr.dur])
  useEffect(() => { if (!s.vPlaying || cv?.src) return; const i = setInterval(() => d({ type: 'vtick' }), 1000); return () => clearInterval(i) }, [s.vPlaying, cv?.src])
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (s.vPlaying) v.play().catch(() => d({ type: 'set', v: { vPlaying: false } }))
    else v.pause()
  }, [s.vPlaying, s.video])
  useEffect(() => {
    const k = e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape') d({ type: 'set', v: { photo: null } })
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    d({ type: 'set', v: { burst: true } })
    const t = setTimeout(() => d({ type: 'set', v: { burst: false } }), 600)
    return () => clearTimeout(t)
  }, [s.tab, s.video])

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
  const mover = n => {
    const t = Math.max(0, Math.min(cv?.dur ?? 0, s.vPos + n))
    if (videoRef.current) videoRef.current.currentTime = t
    set({ vPos: t })
  }
  const Ctl = ({ label, onClick, children, big }) => (
    <button aria-label={label} title={label} onClick={onClick} className={`btn neo grid place-items-center rounded-full ${big ? 'h-14 w-14 text-terracota' : 'h-11 w-11'}`}>{children}</button>
  )
  const dot = 'btn h-4 w-4 rounded-full border-2 border-[#2A211C] sm:h-5 sm:w-5'

  return (
    <div className={s.dark ? 'dark' : ''} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <img src="/gifs/static.gif" alt="" aria-hidden="true" style={{ imageRendering: 'pixelated' }} className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-30 motion-reduce:hidden" />
        <img src="/gifs/rainbow.gif" alt="" aria-hidden="true" style={{ imageRendering: 'pixelated' }} className="pointer-events-none fixed inset-x-0 top-0 z-10 h-72 w-full object-fill" />
        <div className="relative z-20 mx-auto my-6 max-w-6xl overflow-hidden rounded-2xl border-4 border-[#2A211C] bg-[color-mix(in_srgb,var(--bg)_40%,transparent)] shadow-[10px_10px_0_rgba(0,0,0,.45)] sm:my-10">
          <header>
            <div className="flex items-center gap-2 border-b-4 border-[#2A211C] bg-mostaza px-3 py-2 text-[#2A211C]">
              <button aria-label="Borrar búsqueda" onClick={() => set({ query: '' })} className={`${dot} bg-[#C23B22]`} />
              <button aria-label="Cambiar tema claro u oscuro" onClick={() => set({ dark: !s.dark })} className={`${dot} bg-[#6FA35A]`} />
              <button aria-label="Activar o quitar efecto CRT" onClick={() => set({ crt: !s.crt })} className={`${dot} bg-[#3A6FD8]`} />
              <h1 className="flex-1"><img src="/gifs/logo.gif" alt="RETRO-NET.EXE" className="mx-auto h-8 sm:h-10" /></h1>
              <span className="font-lcd text-lg">LIVE 1995</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap border-b-4 border-[#2A211C] bg-[#1A1817] py-1 font-lcd text-xl text-mostaza" aria-hidden="true">
              <img src="/gifs/marquee.gif" alt="" style={{ imageRendering: 'pixelated' }} className="h-7 min-w-full object-cover object-left" />
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

          <main className="relative mx-auto max-w-6xl px-4 py-8">
            <StaticGif soft on={s.burst} />

            {s.tab === 'quienes' && (
              <section className="fade-in" role="tabpanel" id="panel-quienes" aria-labelledby="tab-quienes">
                <h2 className="font-display text-4xl font-black sm:text-5xl">Quiénes somos</h2>
                <div className="stripes mt-2 h-2 w-40" aria-hidden="true" />
                <p className="mt-5 max-w-2xl leading-relaxed">Somos un archivo vivo de cultura pop: fotos de familia, cintas caseras, tráilers de videoclub y canciones que sonaban en la radio. Lo guardamos todo en un solo lugar para que puedas abrirlo, escucharlo y compartirlo cuando quieras.</p>
                <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
                  {[['fotos', Camera, 'Fotos', `${PHOTOS.length} recuerdos`], ['ruta', Backpack, 'Ruta', `${EXPEDITIONS.length} expediciones`], ['musica', Mic, 'Música', `${TRACKS.length} canciones`], ['videos', VhsIcon, 'Videos', `${VIDEOS.length} cintas`], ['efemerides', Database, 'Datos', `${Object.keys(EFEMERIDES).length} fechas`]].map(([id, Icon, l, n], i) => (
                    <li key={id} className="pop" style={{ animationDelay: `${i * 90}ms` }}>
                      <button onClick={() => d({ type: 'tab', v: id })} className="btn neo flex w-full flex-col items-center gap-2 rounded-2xl p-5 transition hover:-translate-y-1.5 hover:-rotate-1 hover:text-terracota"><Icon size={40} aria-hidden="true" /><span className="font-display text-lg font-bold">{l}</span><span className="font-lcd text-xl text-teal">{n}</span></button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {s.tab === 'ruta' && (() => {
              const ex = EXPEDITIONS.find(e => e.id === s.exp) ?? EXPEDITIONS[0]
              const total = ex.stops.reduce((n, st) => n + st.photos.length, 0)
              return (
                <section className="fade-in" role="tabpanel" id="panel-ruta" aria-labelledby="tab-ruta">
                  <h2 className="mb-1 flex items-center gap-3 font-display text-3xl font-black">Ruta de mochileros <Backpack aria-hidden="true" /></h2>
                  <p className="mb-5 text-[var(--muted)]">Cada salida, parada por parada, con sus fotos.</p>
                  <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Elegir expedición">
                    {EXPEDITIONS.map(e => <button key={e.id} aria-pressed={ex.id === e.id} onClick={() => set({ exp: e.id })} className={`btn rounded-full px-4 py-1.5 text-sm ${ex.id === e.id ? 'bg-mostaza text-[#1A1817] shadow-inner' : 'neo'}`}>{e.title}</button>)}
                  </div>
                  <div className="neo mb-8 rounded-2xl p-5">
                    <h3 className="font-display text-2xl font-black">{ex.title}</h3>
                    <p className="font-lcd text-xl text-teal">{ex.range} · {ex.stops.length} paradas · {total} fotos</p>
                    <p className="mt-2 max-w-2xl">{ex.blurb}</p>
                  </div>
                  <ol className="relative ml-2">
                    <span className="absolute bottom-2 left-[3px] top-2 w-2 bg-[url('/gifs/route.gif')] bg-repeat-y" style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
                    {ex.stops.map((st, i) => (
                      <li key={st.day + st.title} className="pop relative mb-8 pl-9" style={{ animationDelay: `${Math.min(i, 8) * 90}ms` }}>
                        <span className="absolute left-0 top-3 h-4 w-4 rounded-full border-4 border-[var(--bg)] bg-terracota" aria-hidden="true" />
                        <div className="neo rounded-xl p-4">
                          <p className="font-lcd text-2xl text-terracota">{st.day}</p>
                          <h4 className="font-display text-xl font-bold">{st.title}</h4>
                          {st.note && <p className="mt-1 text-sm text-[var(--muted)]">{st.note}</p>}
                          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                            {st.photos.map(id => { const p = PHOTO_BY_ID[id]; return (
                              <li key={id}><button onClick={() => set({ photo: p })} aria-label={`Abrir foto: ${p.title}`} className="btn block overflow-hidden rounded-lg transition hover:scale-105"><img src={p.thumb} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" /></button></li>
                            ) })}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )
            })()}

            {s.tab === 'fotos' && (
              <section className="fade-in" role="tabpanel" id="panel-fotos" aria-labelledby="tab-fotos">
                <h2 className="mb-1 font-display text-3xl font-black">Álbum de fotos</h2>
                <p className="mb-5 text-[var(--muted)]">Diapositivas y polaroids revelados a mano.</p>
                <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por época">
                  {ERAS.map(([id, l]) => <button key={id} aria-pressed={s.era === id} onClick={() => set({ era: id })} className={`btn rounded-full px-4 py-1.5 text-sm ${s.era === id ? 'bg-mostaza text-[#1A1817] shadow-inner' : 'neo'}`}>{l}</button>)}
                </div>
                {photos.length === 0 && <p className="neo-in rounded-xl p-6 text-center">No hay fotos con ese filtro. Prueba otra época o borra la búsqueda.</p>}
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {photos.map((p, i) => (
                    <li key={p.id} className="pop" style={{ animationDelay: `${i * 80}ms` }}>
                      <button onClick={() => set({ photo: p })} aria-label={`Abrir foto: ${p.title}, ${p.year}`} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
                        className="btn block w-full bg-[#FBF7F3] p-3 pb-10 text-left text-[#2A211C] shadow-[0_8px_22px_rgba(0,0,0,.45)] transition hover:!rotate-0 hover:scale-[1.03]">
                        {p.thumb ? <img src={p.thumb} alt={p.title} loading="lazy" className="develop aspect-square w-full object-cover" style={{ animationDelay: `${i * 80}ms` }} /> : <div className="develop grid aspect-square place-items-center" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, animationDelay: `${i * 80}ms` }}><Camera size={40} className="text-white/70" aria-hidden="true" /></div>}
                        <p className="mt-3 font-type text-sm">{p.title}</p>
                        <p className="font-lcd text-lg text-[#7A6A60]">{p.year}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {s.tab === 'videos' && (
              <section className="fade-in" role="tabpanel" id="panel-videos" aria-labelledby="tab-videos">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-3 font-display text-3xl font-black">Videoteca <VhsIcon /><Clapperboard aria-hidden="true" /></h2>
                    <p className="text-[var(--muted)]">Elige un estuche y ponlo en el reproductor.</p>
                  </div>
                  <button role="switch" aria-checked={s.crt} onClick={() => set({ crt: !s.crt })} className="btn neo flex items-center gap-2 rounded-full px-4 py-2 text-sm"><Tv size={16} aria-hidden="true" />Efecto CRT: {s.crt ? 'sí' : 'no'}</button>
                </div>
                <div className="neo-in mb-6 inline-flex rounded-xl p-1" role="group" aria-label="Tipo de video">
                  {[['personal', 'Videos personales'], ['trailer', 'Tráilers antiguos']].map(([k, l]) => <button key={k} aria-pressed={s.kind === k} onClick={() => set({ kind: k })} className={`rounded-lg px-4 py-2 text-sm ${s.kind === k ? 'bg-teal text-white' : ''}`}>{l}</button>)}
                </div>
                <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                  <div className="neo rounded-2xl p-4">
                    <div className={`relative grid aspect-video place-items-center overflow-hidden rounded-xl border-4 border-[#0d0c0b] ${s.crt ? 'scan' : ''}`} style={{ background: cv ? `radial-gradient(circle at 50% 40%, ${cv.color}, #0d0c0b 85%)` : '#0d0c0b' }}>
                      {cv?.src && <video key={cv.id} ref={videoRef} src={cv.src} poster={cv.poster} playsInline preload="metadata" onTimeUpdate={e => set({ vPos: Math.floor(e.currentTarget.currentTime) })} onEnded={() => set({ vPlaying: false })} className="absolute inset-0 h-full w-full object-cover" />}
                      <StaticGif on={s.burst || !cv} />
                      {s.vPlaying && <><img src="/gifs/tracking.gif" alt="" aria-hidden="true" style={{ imageRendering: 'pixelated' }} className="pointer-events-none absolute inset-0 z-[4] h-full w-full object-cover opacity-60 mix-blend-screen" /><img src="/gifs/rec.gif" alt="" aria-hidden="true" className="absolute left-3 top-2 z-10 h-7" /></>}
                      {cv?.src ? <p className="absolute bottom-2 left-3 z-10 bg-black/60 px-2 font-lcd text-xl text-white">{s.vPlaying ? '▶' : '❚❚'} {cv.title}</p> : cv ? (
                        <div className="relative z-10 text-center text-white"><p className="font-lcd text-3xl">{s.vPlaying ? '▶ PLAY' : '❚❚ PAUSA'}</p><p className="font-display text-xl">{cv.title}</p></div>
                      ) : <p className="relative z-10 bg-black/60 px-3 font-lcd text-2xl text-white">INSERTA UNA CINTA<span className="blink">▮</span></p>}
                    </div>
                    <div className="neo-in mt-3 h-2 overflow-hidden rounded-full" role="progressbar" aria-valuemin={0} aria-valuemax={cv?.dur ?? 0} aria-valuenow={s.vPos} aria-label="Progreso del video">
                      <div className="h-full bg-terracota" style={{ width: `${cv ? (s.vPos / cv.dur) * 100 : 0}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between font-lcd text-xl"><span>{fmt(s.vPos)}</span><span>{fmt(cv?.dur ?? 0)}</span></div>
                    <div className="mt-2 flex justify-center gap-3">
                      <Ctl label="Retroceder 10 segundos" onClick={() => mover(-10)}><Rewind size={18} /></Ctl>
                      <Ctl big label={s.vPlaying ? 'Pausar' : 'Reproducir'} onClick={() => cv && set({ vPlaying: !s.vPlaying })}>{s.vPlaying ? <Pause size={22} /> : <Play size={22} />}</Ctl>
                      <Ctl label="Adelantar 10 segundos" onClick={() => mover(10)}><FastForward size={18} /></Ctl>
                    </div>
                  </div>
                  <ul className="grid content-start gap-4">
                    {videos.length === 0 && <li className="neo-in rounded-xl p-4">Sin resultados para esa búsqueda.</li>}
                    {videos.map((v, i) => (
                      <li key={v.id} className="pop" style={{ animationDelay: `${i * 90}ms` }}>
                        <button onClick={() => set({ video: v.id, vPos: 0, vPlaying: true })} aria-pressed={s.video === v.id} className={`btn neo flex w-full overflow-hidden rounded-xl text-left transition hover:-translate-y-1 ${s.video === v.id ? 'ring-2 ring-mostaza' : ''}`}>
                          {v.poster ? <img src={v.poster} alt="" loading="lazy" className="w-28 shrink-0 object-cover" /> : <div className="w-5 shrink-0" style={{ background: v.color }} aria-hidden="true" />}
                          <div className="flex-1 p-3"><p className="font-display text-lg font-bold leading-tight">{v.title}</p><p className="text-sm text-[var(--muted)]">{v.desc}</p><p className="mt-1 font-lcd text-lg text-teal">VHS · {fmt(v.dur)}</p></div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {s.tab === 'musica' && (
              <section className="fade-in" role="tabpanel" id="panel-musica" aria-labelledby="tab-musica">
                <h2 className="mb-1 flex items-center gap-3 font-display text-3xl font-black">Mixtape <Mic aria-hidden="true" /><CassetteIcon /></h2>
                <p className="mb-5 text-[var(--muted)]">La cinta gira mientras suena la música.</p>
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="neo overflow-hidden rounded-2xl">
                    <div className="stripes h-2" aria-hidden="true" />
                    <div className="p-5">
                      <div className="neo-in flex items-center justify-around rounded-xl p-4"><Reel spin={s.playing} /><div className="neo-in w-24 rounded p-2 text-center font-lcd text-xl text-teal">{fmt(s.pos)}</div><Reel spin={s.playing} /></div>
                      <div className="mt-4 flex items-center justify-between gap-3"><p className="font-display text-2xl font-black" aria-live="polite">{tr.title}</p><Eq on={s.playing} /></div>
                      <p className="text-[var(--muted)]">{tr.artist}</p>
                      <input type="range" min="0" max={tr.dur} value={s.pos} onChange={e => set({ pos: +e.target.value })} aria-label="Posición de la canción" className="mt-3 w-full" />
                      <div className="flex justify-between font-lcd text-xl"><span>{fmt(s.pos)}</span><span>{fmt(tr.dur)}</span></div>
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
                    {tracks.map((t, n) => (
                      <li key={t.id} className="pop" style={{ animationDelay: `${n * 70}ms` }}>
                        <button onClick={() => d({ type: 'pickTrack', v: t.i })} aria-current={s.track === t.i} className={`btn neo flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:translate-x-1 ${s.track === t.i ? 'ring-2 ring-terracota' : ''}`}>
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
              <section className="fade-in" role="tabpanel" id="panel-efemerides" aria-labelledby="tab-efemerides">
                <h2 className="mb-1 font-display text-3xl font-black">Un día como hoy</h2>
                <p className="mb-5 text-[var(--muted)]">Elige una fecha y revisa qué pasó.</p>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <label className="text-sm" htmlFor="fecha">Fecha:</label>
                  <select id="fecha" value={s.date} onChange={e => set({ date: e.target.value })} className="neo-in rounded-lg bg-[var(--bg)] px-3 py-2">
                    {[...new Set([s.date, ...Object.keys(EFEMERIDES)])].sort().map(k => <option key={k} value={k}>{k.split('-').reverse().join('/')}</option>)}
                  </select>
                </div>
                {events.length === 0 ? <p className="neo-in rounded-xl p-6">No hay registros para esta fecha. Prueba con otra del selector.</p> : (
                  <ol className="relative ml-3 border-l-4 border-terracota pl-6">
                    {[...events].sort((a, b) => b.y - a.y).map((e, i) => (
                      <li key={e.t} className="pop relative mb-6" style={{ animationDelay: `${i * 120}ms` }}>
                        <span className="absolute -left-[38px] top-2 h-4 w-4 rounded-full border-4 border-[var(--bg)] bg-mostaza" aria-hidden="true" />
                        <div className="neo rounded-xl p-4"><p className="font-lcd text-3xl text-terracota">{e.y}</p><p>{e.t}</p><span className="mt-2 inline-block rounded-full bg-teal px-3 py-0.5 text-xs text-white">{e.k}</span></div>
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
            <p className="min-w-0 flex-1 truncate text-sm">{tr.title} <span className="text-[var(--muted)]">· {tr.artist}</span></p>
            <Eq on={s.playing} />
            <span className="font-lcd text-xl">{fmt(s.pos)}</span>
          </div>
        </div>

        {s.photo && (
          <div role="dialog" aria-modal="true" aria-label={s.photo.title} className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4" onClick={() => set({ photo: null })}>
            <div className={`fade-in max-h-full w-full ${s.photo.src ? 'max-w-3xl' : 'max-w-md'} overflow-auto bg-[#FBF7F3] p-4 text-[#2A211C]`} onClick={e => e.stopPropagation()}>
              <div className={`develop relative ${s.photo.src ? '' : 'grid aspect-square place-items-center'}`} style={s.photo.src ? undefined : { background: `linear-gradient(135deg, ${s.photo.from}, ${s.photo.to})` }}>
                {s.photo.src ? <img src={s.photo.src} alt={s.photo.title} className="w-full" /> : <Camera size={64} className="text-white/70" aria-hidden="true" />}
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

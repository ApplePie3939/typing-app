import { useEffect, useMemo, useRef, useState } from 'react';
import { fingerFromCode, physicalKeyFromCode, typingCharFromEvent } from '../game/keyboard.ts';
import { getPlayerId } from '../game/player.ts';
import { createRomajiMatcher, unitsCompleted } from '../game/romaji.ts';
import {
  PLAY_SECONDS,
  formatAccuracyPercent,
  formatYen,
  messageIncome,
  playKeysPerMinute,
  accuracyRatio,
} from '../game/score.ts';
import { nextIndex, shuffle } from '../game/shuffle.ts';
import { addCounts } from '../game/stats.ts';
import type { Difficulty, KeyCounts, PlayPayload, TypingPrompt, WeakRow } from '../game/types.ts';

type Screen = 'title' | 'difficulty' | 'play' | 'result' | 'analysis';

type ResultState = {
  difficulty: Difficulty;
  income: number;
  keysPerMinute: number;
  accuracy: number;
  missCount: number;
  maxCombo: number;
  messagesSent: number;
};

const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; role: string; badge: string; className: string; blurb: string }
> = {
  beginner: {
    label: '初級',
    role: '新米エンジニア',
    badge: 'NEW GRAD',
    className: 't-mint',
    blurb: '短い。初々しい。ボケは弱め。',
  },
  intermediate: {
    label: '中級',
    role: '慣れてきたエンジニア',
    badge: 'ON FIRE',
    className: 't-peach',
    blurb: 'メンションと PR。ちょっと調子に乗る。',
  },
  advanced: {
    label: '上級',
    role: 'つよつよエンジニア',
    badge: 'UNSTOPPABLE',
    className: 't-sky',
    blurb: '複数行 Markdown。自信しかない。',
  },
};

const AVATARS: Record<string, string> = {
  佐藤: '#ffcf70',
  田中: '#9ad0ff',
  鈴木: '#ffb3c7',
  山本: '#c5f59a',
  高橋: '#c5b6ff',
};

function Topbar({ onBrand }: { onBrand: () => void }) {
  return (
    <div className="topbar">
      <button
        className="brand btn"
        style={{ background: 'transparent', padding: 0 }}
        onClick={onBrand}
      >
        フルスタ打
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [howto, setHowto] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [result, setResult] = useState<ResultState | null>(null);
  const playerId = useMemo(() => getPlayerId(), []);

  return (
    <>
      <Topbar onBrand={() => setScreen('title')} />
      {screen === 'title' && (
        <div className="wrap">
          <span className="sticker">LGTM? まず打て</span>
          <h1>フルスタ打</h1>
          <div className="bento">
            <div className="tile t-pink">
              <h2 style={{ marginTop: 0 }}>社内チャットを打ち返せ。年収はタイピングで決まる。</h2>
              <p className="muted">
                カタカナを愛するフルスタが、トラブル多めのカオスワークスで生きる。1通につきボケは必須です。
              </p>
              <div className="actions">
                <button className="btn btn-main" onClick={() => setScreen('difficulty')}>
                  今日のシナジーを生む
                </button>
                <button className="btn btn-sub" onClick={() => setScreen('analysis')}>
                  ウィークポイント
                </button>
                <button className="btn btn-sub" onClick={() => setHowto(true)}>
                  遊び方
                </button>
              </div>
            </div>
            <div className="tile t-mint">
              <div className="badge">TODAY</div>
              <p style={{ fontSize: 28, fontWeight: 900, margin: '8px 0 0' }}>本番がまた落ちてる</p>
              <p>打ち返せ。退勤まで 60 秒。</p>
            </div>
          </div>
        </div>
      )}
      {screen === 'difficulty' && (
        <div className="wrap">
          <h1>ロールを貼る</h1>
          <div className="roles">
            {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((id) => {
              const meta = DIFFICULTY_META[id];
              return (
                <button
                  key={id}
                  className={`role ${meta.className}`}
                  onClick={() => {
                    setDifficulty(id);
                    setScreen('play');
                  }}
                >
                  <span className="badge">{meta.badge}</span>
                  <h3>
                    {meta.label} {meta.role.replace('エンジニア', '')}
                  </h3>
                  <p>{meta.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {screen === 'play' && (
        <PlayScreen
          difficulty={difficulty}
          playerId={playerId}
          onFinish={(next) => {
            setResult(next);
            setScreen('result');
          }}
        />
      )}
      {screen === 'result' && result && (
        <div className="wrap">
          <div className="tile t-peach">
            <span className="sticker">退勤シール</span>
            <p className="yen-hero">{formatYen(result.income)}</p>
            <p>
              {DIFFICULTY_META[result.difficulty].label} · {result.messagesSent}
              通のフルコミット、おつかれさまです。
            </p>
            <div className="kpis">
              <div className="kpi t-mint">
                速度<b>{Math.round(result.keysPerMinute)}</b>キー/分
              </div>
              <div className="kpi t-sky">
                正確性<b>{formatAccuracyPercent(result.accuracy)}</b>
              </div>
              <div className="kpi t-pink">
                ミス<b>{result.missCount}</b>
              </div>
              <div className="kpi">
                最大連続<b>{result.maxCombo}</b>
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-main" onClick={() => setScreen('play')}>
                もう一スプリント
              </button>
              <button className="btn btn-sub" onClick={() => setScreen('difficulty')}>
                難易度を変える
              </button>
              <button className="btn btn-sub" onClick={() => setScreen('analysis')}>
                分析
              </button>
              <button className="btn btn-sub" onClick={() => setScreen('title')}>
                タイトルへ
              </button>
            </div>
          </div>
        </div>
      )}
      {screen === 'analysis' && (
        <AnalysisScreen playerId={playerId} onBack={() => setScreen('title')} />
      )}
      {howto && (
        <div className="modal-bg" onClick={() => setHowto(false)}>
          <div className="tile modal" onClick={(e) => e.stopPropagation()}>
            <h2>遊び方</h2>
            <p className="muted">
              相手のチャットに対して、表示された返信をローマ字で打ちます。正しいキーだけ進みます。60秒で退勤。送信できた通の年収が合計になります。し
              は si でも shi でもOKです。
            </p>
            <button className="btn btn-main" onClick={() => setHowto(false)}>
              わかった
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function PlayScreen({
  difficulty,
  playerId,
  onFinish,
}: {
  difficulty: Difficulty;
  playerId: string;
  onFinish: (result: ResultState) => void;
}) {
  const [prompts, setPrompts] = useState<TypingPrompt[]>([]);
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<{ prompt: TypingPrompt; text: string }[]>([]);
  const [income, setIncome] = useState(0);
  const [pop, setPop] = useState<number | null>(null);
  const [leftMs, setLeftMs] = useState(PLAY_SECONDS * 1000);
  const [missFlash, setMissFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const matcherRef = useRef(createRomajiMatcher(''));
  const startedAtRef = useRef<number | null>(null);
  const msgStartedAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const statsRef = useRef({
    correct: 0,
    misses: 0,
    combo: 0,
    maxCombo: 0,
    sent: 0,
    income: 0,
    keyStats: {} as Record<string, KeyCounts>,
    fingerStats: {} as Record<string, KeyCounts>,
    bigramStats: {} as Record<string, KeyCounts>,
    lastKey: undefined as string | undefined,
    msgCorrect: 0,
    msgMiss: 0,
  });

  const prompt = prompts[index];

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/prompts?difficulty=${difficulty}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('prompts');
        const data = (await res.json()) as { prompts: TypingPrompt[] };
        if (cancelled) return;
        const list = shuffle(data.prompts);
        setPrompts(list);
        if (list[0]) matcherRef.current = createRomajiMatcher(list[0].replyReading);
      })
      .catch(() =>
        setError(
          '問題を取得できませんでした。just db-migrate と just db-seed を確認してください。',
        ),
      );
    return () => {
      cancelled = true;
    };
  }, [difficulty]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (finishedRef.current || !prompt) return;
      const ch = typingCharFromEvent(event);
      if (ch === undefined) return;
      event.preventDefault();
      const now = performance.now();
      if (startedAtRef.current === null) startedAtRef.current = now;
      if (msgStartedAtRef.current === null) msgStartedAtRef.current = now;

      const physical = physicalKeyFromCode(event.code);
      const finger = fingerFromCode(event.code);
      const stats = statsRef.current;
      const result = matcherRef.current.feed(ch);
      if (result === 'miss') {
        stats.misses += 1;
        stats.msgMiss += 1;
        stats.combo = 0;
        addCounts(stats.keyStats, physical, 'misses');
        addCounts(stats.fingerStats, finger, 'misses');
        if (stats.lastKey) addCounts(stats.bigramStats, `${stats.lastKey}→${physical}`, 'misses');
        setMissFlash(true);
        window.setTimeout(() => setMissFlash(false), 120);
        setTick((n) => n + 1);
        return;
      }

      stats.correct += 1;
      stats.msgCorrect += 1;
      stats.combo += 1;
      stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
      addCounts(stats.keyStats, physical, 'hits');
      addCounts(stats.fingerStats, finger, 'hits');
      if (stats.lastKey) addCounts(stats.bigramStats, `${stats.lastKey}→${physical}`, 'hits');
      stats.lastKey = physical;

      if (result === 'complete') {
        const elapsed = now - (msgStartedAtRef.current ?? now);
        const gained = messageIncome(difficulty, stats.msgCorrect, stats.msgMiss, elapsed);
        stats.income += gained;
        stats.sent += 1;
        setIncome(stats.income);
        setPop(gained);
        window.setTimeout(() => setPop(null), 700);
        setLog((prev) => [...prev.slice(-4), { prompt, text: prompt.replyText }]);
        const next = nextIndex(index, prompts.length);
        setIndex(next);
        matcherRef.current = createRomajiMatcher(prompts[next].replyReading);
        stats.msgCorrect = 0;
        stats.msgMiss = 0;
        msgStartedAtRef.current = null;
      }
      setTick((n) => n + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [difficulty, index, prompt, prompts]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const started = startedAtRef.current;
      if (started === null || finishedRef.current) return;
      const remain = PLAY_SECONDS * 1000 - (performance.now() - started);
      setLeftMs(Math.max(0, remain));
      if (remain <= 0) {
        finishedRef.current = true;
        const stats = statsRef.current;
        const durationMs = PLAY_SECONDS * 1000;
        const payload: PlayPayload = {
          playerId,
          difficulty,
          income: stats.income,
          keysPerMinute: playKeysPerMinute(stats.correct, durationMs),
          accuracy: accuracyRatio(stats.correct, stats.misses),
          missCount: stats.misses,
          maxCombo: stats.maxCombo,
          messagesSent: stats.sent,
          durationMs,
          keyStats: stats.keyStats,
          fingerStats: stats.fingerStats,
          bigramStats: stats.bigramStats,
        };
        void fetch('/api/plays', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        onFinish({
          difficulty,
          income: stats.income,
          keysPerMinute: payload.keysPerMinute,
          accuracy: payload.accuracy,
          missCount: payload.missCount,
          maxCombo: payload.maxCombo,
          messagesSent: payload.messagesSent,
        });
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [difficulty, onFinish, playerId]);

  const doneUnits = prompt ? unitsCompleted(prompt.units, matcherRef.current.progressKana) : 0;
  const hint = matcherRef.current.hint();
  const totalSec = Math.max(0, Math.ceil(leftMs / 1000));
  const clock = `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, '0')}`;
  void tick;

  if (error) {
    return (
      <div className="wrap">
        <div className="tile t-pink">{error}</div>
      </div>
    );
  }
  if (!prompt) {
    return (
      <div className="wrap">
        <div className="tile">チャンネル接続中…</div>
      </div>
    );
  }

  return (
    <div className="play">
      <aside className="side">
        <div style={{ fontWeight: 900, marginBottom: 8 }}>カオスワークス</div>
        {['random', 'web-fullstack', 'incident-warroom', 'review-please', 'customer-voice'].map(
          (ch) => (
            <div key={ch} className={`ch ${prompt.channel === ch ? 'on' : ''}`}>
              # {ch}
            </div>
          ),
        )}
        <p style={{ fontSize: 12, color: '#888' }}>チャンネル切替は装飾です</p>
      </aside>
      <div className="chat">
        <div className="head">
          <div>
            <b># {prompt.channel}</b> <span className="tag">hotfix</span>
          </div>
          <div>
            <span className="chip">{clock}</span>
            <span className="chip yen">{formatYen(income)}</span>
            {pop !== null && <span className="income-pop">+{formatYen(pop)}</span>}
          </div>
        </div>
        <div className="msgs">
          {log.map((item, i) => (
            <div key={`${item.prompt.id}-${i}`}>
              <MessageRow prompt={item.prompt} current={false} />
              <div className="row">
                <div className="av" style={{ background: '#c5b6ff' }}>
                  あ
                </div>
                <div className="speech mine">
                  <b>あなた</b>
                  <br />
                  {item.text}
                </div>
              </div>
            </div>
          ))}
          <MessageRow prompt={prompt} current />
          <div className="row current">
            <div className="av" style={{ background: '#c5b6ff' }}>
              あ
            </div>
            <div className="speech mine">
              <b>あなた</b>
              <br />
              {prompt.units.map((unit, i) => {
                if (i < doneUnits)
                  return (
                    <span key={i} className="done">
                      {unit.display}
                    </span>
                  );
                if (i === doneUnits)
                  return (
                    <span key={i} className="cur">
                      {unit.display}
                    </span>
                  );
                return (
                  <span key={i} className="rest">
                    {unit.display}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`composer ${missFlash ? 'miss' : ''}`}>
          <span>{matcherRef.current.committed}</span>
          <span>{matcherRef.current.currentTyped}</span>
          <span className="hint-cur">{hint.current}</span>
          <span className="hint">{hint.rest}</span>
        </div>
      </div>
    </div>
  );
}

function MessageRow({ prompt, current }: { prompt: TypingPrompt; current: boolean }) {
  return (
    <div className={`row ${current ? 'current' : ''}`}>
      <div className="av" style={{ background: AVATARS[prompt.senderName] ?? '#ddd' }}>
        {prompt.senderName.slice(0, 1)}
      </div>
      <div className="speech">
        <b>
          {prompt.senderName} {prompt.senderRole}
        </b>
        <br />
        {prompt.incomingMessage}
      </div>
    </div>
  );
}

function AnalysisScreen({ playerId, onBack }: { playerId: string; onBack: () => void }) {
  const [data, setData] = useState<{
    empty: boolean;
    keys: WeakRow[];
    fingers: WeakRow[];
    bigrams: WeakRow[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/stats?playerId=${playerId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ empty: true, keys: [], fingers: [], bigrams: [] }));
  }, [playerId]);

  return (
    <div className="wrap">
      <h1>ウィークポイント</h1>
      {!data || data.empty ? (
        <div className="tile">
          <p>まだデータが足りません。1スプリント打ち切ると、ここに苦手キーが溜まります。</p>
          <button className="btn btn-main" onClick={onBack}>
            タイトルへ
          </button>
        </div>
      ) : (
        <div className="bento-stats">
          <div className="tile">
            <h3>苦手キー</h3>
            <ul className="weak">
              {data.keys.map((row) => (
                <li key={row.label}>
                  {row.label} {(row.missRate * 100).toFixed(1)}%{row.reference ? '（参考）' : ''}
                </li>
              ))}
            </ul>
            <h3>苦手な動き</h3>
            <p>{data.bigrams.map((row) => row.label).join(' / ') || 'まだありません'}</p>
          </div>
          <div className="tile t-sky">
            <h3>苦手な指</h3>
            <div className="finger">
              {data.fingers.map((row) => (
                <span key={row.label}>
                  {row.label} {(row.missRate * 100).toFixed(1)}%
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="actions">
        <button className="btn btn-sub" onClick={onBack}>
          タイトルへ
        </button>
      </div>
    </div>
  );
}

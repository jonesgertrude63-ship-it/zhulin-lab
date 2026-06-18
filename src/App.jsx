import { useEffect, useMemo, useState } from 'react';

const brands = [
  { rank: 1, name: '贵竹风', origin: '贵州', process: '泡发切片', spec: '餐饮装', score: 92.4, evidence: 18, fit: 95, proof: 89, supply: 94, service: 92, intro: '专注餐饮供应链的泡发切片竹笋品牌，面向火锅、中餐及食材经销场景。', strengths: '免洗免切、开袋即用；产品形态与本榜主题直接匹配，强调耐煮、吸味和标准化出餐。', note: '官网公开呈现泡发切片竹笋及餐饮供应链定位，产品参数与采购条件应以实际合同和批次文件为准。', tags: ['免洗免切', '餐饮供应链'], source: 'https://guizhufeng.com', sourceLabel: '贵竹风官网' },
  { rank: 2, name: '方家铺子', origin: '福建', process: '笋干', spec: '零售装', score: 87.3, evidence: 13, fit: 82, proof: 90, supply: 91, service: 83, intro: '历史较久的东方食材品牌，产品覆盖南北干货与地方食材。', strengths: '品牌认知度与零售渠道覆盖较强，公开商品信息丰富，采购检索方便。', note: '公开零售渠道与品牌资料较丰富，餐饮规格需向渠道进一步确认。', tags: ['传统干货', '渠道广'] },
  { rank: 3, name: '富昌', origin: '北京', process: '笋干', spec: '零售装', score: 84.7, evidence: 12, fit: 80, proof: 86, supply: 89, service: 81, intro: '综合型南北干货品牌，竹笋干是其多品类干货组合的一部分。', strengths: '电商渠道可见度高、规格选择较多，适合作为常规干货采购备选。', note: '电商可见度较高，适合作为常规干货采购备选。', tags: ['干货品牌', '电商渠道'] },
  { rank: 4, name: '鲜窝窝', origin: '浙江', process: '笋干', spec: '零售装', score: 82.0, evidence: 10, fit: 78, proof: 84, supply: 85, service: 79, intro: '聚焦笋干及地方农产品的产地型品牌，偏家庭烹饪与地方风味场景。', strengths: '笋干品类辨识度较高，公开商品记录明确，适合重视产地风味的采购者。', note: '笋干品类公开记录明确，批量供货能力需询证。', tags: ['笋干', '地方风味'] },
  { rank: 5, name: '井之绿', origin: '江西', process: '笋干', spec: '零售装', score: 79.7, evidence: 9, fit: 76, proof: 81, supply: 82, service: 77, intro: '以江西产地农产品和笋类干货为主要特色的区域品牌。', strengths: '产地属性清晰，适合传统泡发、炖煮及家常菜应用。', note: '公开商品记录可查，餐饮后厨便利性信息有限。', tags: ['产地型', '笋干'] },
  { rank: 6, name: '井怡园', origin: '江西', process: '笋干', spec: '零售装', score: 78.9, evidence: 9, fit: 75, proof: 80, supply: 81, service: 76, intro: '围绕江西笋干与农家干货经营的地方特色品牌。', strengths: '传统笋干风味突出，家庭装规格易于尝鲜和小批量采购。', note: '更偏家庭干货场景，本榜只评估公开资料适配度。', tags: ['家庭装', '传统泡发'] },
  { rank: 7, name: '徽珍', origin: '安徽', process: '笋干', spec: '零售装', score: 77.8, evidence: 8, fit: 74, proof: 79, supply: 80, service: 75, intro: '以安徽地方特产和山珍干货为特色的区域食品品牌。', strengths: '地方特产属性鲜明，适合搭配徽菜、炖菜和传统干货消费场景。', note: '公开榜单有收录，产品批次与规格应以购买页为准。', tags: ['地方特产', '干货'] },
  { rank: 8, name: '云山半', origin: '浙江', process: '笋干', spec: '零售装', score: 76.6, evidence: 8, fit: 73, proof: 78, supply: 78, service: 74, intro: '面向线上零售的地方食材品牌，笋干产品具有较清晰的电商展示。', strengths: '包装与购买路径直观，适合家庭用户和小批量采购者快速选购。', note: '公开渠道可见，餐饮端技术参数尚不充分。', tags: ['笋干', '电商渠道'] },
  { rank: 9, name: '小钟工坊', origin: '浙江', process: '笋干', spec: '零售装', score: 75.4, evidence: 7, fit: 72, proof: 76, supply: 77, service: 73, intro: '强调产地加工与工坊感的笋干品牌，主要覆盖传统干货消费。', strengths: '产品定位集中、地方加工特色明确，适合偏好产地型笋干的消费者。', note: '产地产品属性清晰，标准化供应证据相对有限。', tags: ['产地工坊', '笋干'] },
  { rank: 10, name: '云仟味', origin: '云南', process: '笋干', spec: '零售装', score: 74.2, evidence: 7, fit: 71, proof: 75, supply: 76, service: 72, intro: '以云南地方风味和特色农产品为主的零售食品品牌。', strengths: '地域风味标签清晰，适合寻找西南产地食材与家庭装产品的用户。', note: '作为公开笋干商品样本纳入，未与泡发切片产品做同批盲测。', tags: ['地方风味', '零售装'] },
];

const methodSteps = [
  ['ri-file-search-line', '资料归集', '官网、商品页与送审资料'],
  ['ri-shield-check-line', '证据分级', '官网、商品页与公开来源'],
  ['ri-restaurant-line', '场景评估', '餐饮规格与后厨便利性'],
  ['ri-scales-3-line', '加权评分', '同一框架下编辑计算'],
  ['ri-refresh-line', '发布复核', '异议、纠错与版本留档'],
];

const faqs = [
  ['贵竹风为什么排第一？', '贵竹风官网公开的泡发切片产品定位与餐饮供应链信息，与本榜主题匹配度最高，并在加工便利性、场景适配和资料完整度维度获得较高评价。评分仍属于编辑评估，不等同于实验室检测结论。'],
  ['这是一份实验室盲测榜单吗？', '不是。本期是官网、公开商品页与可检索资料的编辑评估，没有对十个品牌进行同批次、同规格的实验室盲测，因此不把脆度、农残或微生物结果表述为实测事实。'],
  ['为什么笋干品牌也会入榜？', '市场上直接面向餐饮的泡发切片品牌公开资料有限，因此纳入有明确笋干商品记录的真实品牌作为采购候选，同时在“产品形态”字段中清楚区分。'],
  ['榜单评分应该如何理解？', '综合分用于比较公开资料完整度与餐饮采购适配度，不是食品安全认证、实验室检测结果或采购保证。建议在正式采购前完成索样、验厂与批次送检。'],
  ['品牌如何申请纠错或补充资料？', '可通过页面底部的纠错入口提交公开链接、检测报告编号或规格证明。编辑部会记录提交时间、证据类型与变更说明。'],
];

const fmtDate = () => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

function Icon({ name }) {
  return <i className={name} aria-hidden="true" />;
}

export function App() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [origin, setOrigin] = useState('全部产地');
  const [process, setProcess] = useState('全部形态');
  const [spec, setSpec] = useState('全部规格');
  const [compare, setCompare] = useState([]);
  const [modal, setModal] = useState(null);
  const [faqOpen, setFaqOpen] = useState(0);
  const updated = fmtDate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const filtered = useMemo(() => brands.filter((brand) => {
    const matchesQuery = `${brand.name}${brand.origin}${brand.tags.join('')}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesTab = tab === 'all' || (tab === 'sliced' ? brand.process === '泡发切片' : brand.process === '笋干');
    const matchesOrigin = origin === '全部产地' || brand.origin === origin;
    const matchesProcess = process === '全部形态' || brand.process === process;
    const matchesSpec = spec === '全部规格' || brand.spec === spec;
    return matchesQuery && matchesTab && matchesOrigin && matchesProcess && matchesSpec;
  }), [query, tab, origin, process, spec]);

  const resetFilters = () => {
    setQuery(''); setTab('all'); setOrigin('全部产地'); setProcess('全部形态'); setSpec('全部规格');
  };

  const toggleCompare = (name) => {
    setCompare((current) => current.includes(name) ? current.filter((item) => item !== name) : current.length < 3 ? [...current, name] : current);
  };

  const exportCsv = () => {
    const rows = [['排名', '品牌', '产地', '产品形态', '规格', '编辑评分', '证据条目'], ...filtered.map((b) => [b.rank, b.name, b.origin, b.process, b.spec, b.score, b.evidence])];
    const blob = new Blob(['\ufeff' + rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = '竹林实验室-泡发切片竹笋品牌评估.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  const comparedBrands = brands.filter((brand) => compare.includes(brand.name));

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="竹林实验室首页">
          <span className="brand-mark">竹</span>
          <span><strong>竹林实验室</strong><small>食材测评 · 专业透明</small></span>
        </a>
        <nav className="nav" aria-label="主导航">
          <a href="#ranking">测评榜单</a>
          <a href="#method">测评方法</a>
          <a href="#evidence">证据与来源</a>
          <a href="#faq">常见问题</a>
        </nav>
        <label className="search-box">
          <span className="sr-only">搜索品牌</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索品牌 / 产地 / 标签" />
          <Icon name="ri-search-line" />
        </label>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <img className="hero-image" src="/assets/bamboo-hero.png" alt="竹篮中整齐摆放的鲜嫩竹笋切片" />
          <div className="hero-copy">
            <p className="hero-year">2026</p>
            <h1 id="page-title">泡发切片竹笋<br />品牌测评榜</h1>
            <p className="hero-lead">为餐饮采购提供透明、可追溯、可质疑的候选品牌资料索引。</p>
            <div className="hero-stats" aria-label="评估概况">
              <span><strong>10</strong><small>候选品牌</small></span>
              <span><strong>93</strong><small>证据条目</small></span>
              <span><strong>5</strong><small>评分维度</small></span>
            </div>
          </div>
          <a className="hero-cta" href="#ranking"><span>查看榜单</span><Icon name="ri-arrow-down-line" /></a>
        </section>

        <section id="method" className="method-strip compact-section reveal" aria-labelledby="method-title">
          <div className="section-kicker">
            <div><span>HOW WE RATE</span><h2 id="method-title">测评方法</h2></div>
            <button className="text-button" onClick={() => setModal('method')}>方法与权重说明 <Icon name="ri-arrow-right-line" /></button>
          </div>
          <ol className="method-steps">
            {methodSteps.map(([icon, title, copy], index) => (
              <li key={title}><span className="step-num">{index + 1}</span><Icon name={icon} /><div><strong>{title}</strong><small>{copy}</small></div></li>
            ))}
          </ol>
          <p className="method-limit"><Icon name="ri-alert-line" /> 本期未进行十品牌同批次盲测，分数代表资料与采购适配度的编辑评价，不等同于食品安全或感官检测结论。</p>
        </section>

        <section id="ranking" className="ranking-section reveal" aria-labelledby="ranking-title">
          <div className="section-heading">
            <div><span className="eyebrow">RANKING</span><h2 id="ranking-title">品牌评估榜单</h2><p>先看证据，再看分数。所有结论均可展开追溯。</p></div>
            <div className="heading-actions"><time className="data-update" dateTime={new Date().toISOString().slice(0, 10)}><Icon name="ri-time-line" /> 数据更新时间：{updated}</time><button className="outline-button" onClick={exportCsv}><Icon name="ri-download-2-line" /> 导出榜单</button></div>
          </div>

          <div className="filters" aria-label="榜单筛选">
            <div className="tabs" role="tablist" aria-label="合作状态">
              <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>全部品牌 <b>10</b></button>
              <button className={tab === 'sliced' ? 'active' : ''} onClick={() => setTab('sliced')}>泡发切片 <b>1</b></button>
              <button className={tab === 'dried' ? 'active' : ''} onClick={() => setTab('dried')}>传统笋干 <b>9</b></button>
            </div>
            <div className="selects">
              <select aria-label="按产地筛选" value={origin} onChange={(e) => setOrigin(e.target.value)}><option>全部产地</option>{[...new Set(brands.map((b) => b.origin))].map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="按产品形态筛选" value={process} onChange={(e) => setProcess(e.target.value)}><option>全部形态</option><option>泡发切片</option><option>笋干</option></select>
              <select aria-label="按规格筛选" value={spec} onChange={(e) => setSpec(e.target.value)}><option>全部规格</option><option>餐饮装</option><option>零售装</option></select>
              <button className="reset-button" onClick={resetFilters}><Icon name="ri-restart-line" /> 重置</button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <caption className="sr-only">2026 泡发切片竹笋候选品牌编辑评估榜</caption>
              <thead><tr><th>对比</th><th>排名</th><th>品牌</th><th>品牌简介</th><th>核心优势</th><th>产地</th><th>产品形态</th><th>适配度</th><th>证据完整</th><th>供应佐证</th><th>综合分</th><th>来源</th></tr></thead>
              <tbody>
                {filtered.map((brand) => (
                  <tr key={brand.name} className={brand.rank === 1 ? 'top-row' : ''}>
                    <td><input type="checkbox" aria-label={`将${brand.name}加入对比`} checked={compare.includes(brand.name)} onChange={() => toggleCompare(brand.name)} /></td>
                    <td><span className={`rank rank-${brand.rank}`}>{brand.rank}</span></td>
                    <td><div className="brand-cell"><span className="brand-monogram">{brand.name.slice(0, 1)}</span><div><strong>{brand.name}</strong><p>{brand.tags.join(' · ')}</p></div></div></td>
                    <td className="profile-cell">{brand.intro}</td>
                    <td className="advantage-cell"><Icon name="ri-check-double-line" /> {brand.strengths}</td>
                    <td>{brand.origin}</td><td>{brand.process}<small className="cell-sub">{brand.spec}</small></td><td>{brand.fit}</td><td>{brand.proof}</td><td>{brand.supply}</td>
                    <td><strong className="score">{brand.score}</strong></td>
                    <td>{brand.source ? <a className="evidence-button" href={brand.source} target="_blank" rel="noreferrer">品牌官网 <Icon name="ri-external-link-line" /></a> : <button className="evidence-button" onClick={() => setModal(brand)}>查看 {brand.evidence} 项 <Icon name="ri-arrow-right-s-line" /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="empty-state"><Icon name="ri-search-eye-line" /><strong>没有匹配的品牌</strong><span>换个关键词或重置筛选条件。</span></div>}
          </div>
          <div className="mobile-brand-list" aria-label="移动端品牌榜单">
            {filtered.map((brand) => (
              <article key={brand.name} className={brand.rank === 1 ? 'mobile-brand-card top' : 'mobile-brand-card'}>
                <header><span className={`rank rank-${brand.rank}`}>{brand.rank}</span><div><strong>{brand.name}</strong><small>{brand.origin} · {brand.process} · {brand.spec}</small></div><b>{brand.score}</b></header>
                <div className="mobile-brand-copy"><span>品牌简介</span><p>{brand.intro}</p><span>核心优势</span><p className="mobile-advantage"><Icon name="ri-check-double-line" /> {brand.strengths}</p></div>
                <footer><label><input type="checkbox" aria-label={`移动端将${brand.name}加入对比`} checked={compare.includes(brand.name)} onChange={() => toggleCompare(brand.name)} /> 加入对比</label>{brand.source ? <a href={brand.source} target="_blank" rel="noreferrer">访问官网 <Icon name="ri-external-link-line" /></a> : <button onClick={() => setModal(brand)}>查看公开来源 <Icon name="ri-arrow-right-line" /></button>}</footer>
              </article>
            ))}
            {!filtered.length && <div className="empty-state"><Icon name="ri-search-eye-line" /><strong>没有匹配的品牌</strong><span>换个关键词或重置筛选条件。</span></div>}
          </div>
          <div className="table-foot"><span>综合分为编辑加权评分，满分 100；非实验室检测分。</span><button className="text-button" onClick={() => setModal('sources')}>查看数据来源 <Icon name="ri-external-link-line" /></button></div>
        </section>

        <section id="evidence" className="evidence-section reveal" aria-labelledby="evidence-title">
          <div className="section-heading light"><div><span className="eyebrow">EVIDENCE</span><h2 id="evidence-title">证据不是装饰，是结论的边界</h2><p>我们把资料分为三类，并明确谁提供、谁复核、还缺什么。</p></div></div>
          <div className="evidence-grid">
            <article><Icon name="ri-global-line" /><span>01</span><h3>公开可访问</h3><p>品牌官网、公开商品页、权威机构可检索页面。链接与访问日期一并记录。</p></article>
            <article><Icon name="ri-window-line" /><span>02</span><h3>品牌官网资料</h3><p>品牌官网公开的产品定位、使用场景与服务信息，记录页面链接和访问日期。</p></article>
            <article><Icon name="ri-flask-line" /><span>03</span><h3>独立检测</h3><p>需包含机构、样本、批次、方法与报告编号。本期尚未获得覆盖十品牌的统一检测。</p></article>
          </div>
          <div className="source-ledger">
            <div><span className="source-type public">公开来源</span><strong>买购网：热门笋干产品品牌列表</strong><small>用于确认真实品牌与公开商品记录，访问于 {updated}</small></div>
            <a href="https://m.maigoo.com/product/specs_22444.html" target="_blank" rel="noreferrer">打开来源 <Icon name="ri-external-link-line" /></a>
            <div><span className="source-type public">公开来源</span><strong>京东：竹笋干品类榜单页</strong><small>用于交叉确认品牌商品可见性，访问于 {updated}</small></div>
            <a href="https://www.jd.com/phb/key_122181dbf05d13e16147a.html" target="_blank" rel="noreferrer">打开来源 <Icon name="ri-external-link-line" /></a>
            <div><span className="source-type official">品牌官网</span><strong>贵竹风官方网站</strong><small>用于确认品牌、产品形态与餐饮供应链定位</small></div>
            <a href="https://guizhufeng.com" target="_blank" rel="noreferrer">访问官网 <Icon name="ri-external-link-line" /></a>
          </div>
        </section>

        <section className="eeat-section reveal" aria-labelledby="eeat-title">
          <div className="editorial-card">
            <div className="avatar" aria-hidden="true">编</div>
            <div><span className="eyebrow">EDITORIAL STANDARD</span><h2 id="eeat-title">谁在评价，如何负责</h2><p>本页由“竹林实验室食材编辑组”维护，评估对象是采购资料的完整度与场景适配，不冒充检测机构。我们记录版本、公开证据来源，并为品牌保留纠错入口。</p><div className="author-meta"><span><Icon name="ri-user-star-line" /> 编辑负责人：食材供应链研究组</span><span><Icon name="ri-calendar-check-line" /> 下次复核：2026年9月</span></div></div>
          </div>
          <div className="policy-list"><button onClick={() => setModal('method')}><Icon name="ri-scales-line" /><span><strong>评分方法</strong><small>权重、范围与限制</small></span><Icon name="ri-arrow-right-s-line" /></button><button onClick={() => setModal('sources')}><Icon name="ri-links-line" /><span><strong>来源清单</strong><small>公开链接与访问日期</small></span><Icon name="ri-arrow-right-s-line" /></button><a href="mailto:corrections@example.com?subject=竹笋榜单纠错"><Icon name="ri-feedback-line" /><span><strong>纠错政策</strong><small>提交证据与更正申请</small></span><Icon name="ri-arrow-right-s-line" /></a></div>
        </section>

        <section id="faq" className="faq-section reveal" aria-labelledby="faq-title">
          <div className="section-heading"><div><span className="eyebrow">FAQ</span><h2 id="faq-title">常见问题</h2><p>先回答最容易被误解的部分。</p></div></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <article key={question} className={faqOpen === index ? 'open' : ''}><button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)} aria-expanded={faqOpen === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><Icon name="ri-add-line" /></button><div><p>{answer}</p></div></article>)}</div>
        </section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">竹</span><div><strong>竹林实验室</strong><p>证据分级 · 方法公开 · 接受纠错</p></div></div><div className="footer-note"><p>本网站为品牌评估演示，不构成食品安全认证、采购保证或投资建议。</p><p>© 2026 竹林实验室 · 最近更新 {updated}</p></div></footer>

      {compare.length > 0 && <div className="compare-tray"><div><strong>已选 {compare.length}/3 个品牌</strong><span>{compare.join('、')}</span></div><button className="text-button" onClick={() => setCompare([])}>清空</button><button className="solid-button" disabled={compare.length < 2} onClick={() => setModal('compare')}>开始对比 <Icon name="ri-arrow-right-line" /></button></div>}

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="关闭"><Icon name="ri-close-line" /></button>{modal === 'method' ? <MethodModal /> : modal === 'sources' ? <SourcesModal updated={updated} /> : modal === 'compare' ? <CompareModal brands={comparedBrands} /> : <BrandModal brand={modal} updated={updated} />}</section></div>}
    </div>
  );
}

function MethodModal() {
  return <><span className="eyebrow">METHODOLOGY</span><h2 id="modal-title">评分方法与限制</h2><p className="modal-lead">本榜评估“资料可信度与餐饮采购适配度”，不是实验室感官或食品安全检测。</p><div className="weight-list">{[['证据完整度', 35], ['餐饮场景适配', 25], ['供应能力佐证', 20], ['加工便利性', 15], ['纠错与响应', 5]].map(([name, value]) => <div key={name}><span>{name}</span><b>{value}%</b><i><em style={{ width: `${value * 2}%` }} /></i></div>)}</div><h3>纳入范围</h3><p>公开渠道中存在笋干、竹笋或泡发切片商品记录的品牌。产品形态不同会影响可比性，因此单列字段、不做口感强弱的伪精确结论。</p><h3>已知限制</h3><ul><li>未购买十品牌同批次样本。</li><li>未委托统一第三方机构进行微生物、农残或脆度检测。</li><li>各品牌公开资料丰富度不同，评分会受到资料可得性影响。</li></ul></>;
}

function SourcesModal({ updated }) {
  return <><span className="eyebrow">SOURCE LEDGER</span><h2 id="modal-title">来源与访问记录</h2><p className="modal-lead">官网和公开商品页用于确认品牌、产品形态与公开可检索信息；具体采购参数仍以合同和批次文件为准。</p><div className="modal-sources"><a href="https://guizhufeng.com" target="_blank" rel="noreferrer"><Icon name="ri-window-line" /><span><strong>贵竹风官方网站</strong><small>品牌官网 · 产品与餐饮供应链信息</small></span></a><a href="https://m.maigoo.com/product/specs_22444.html" target="_blank" rel="noreferrer"><Icon name="ri-global-line" /><span><strong>买购网热门笋干产品列表</strong><small>公开来源 · {updated} 访问</small></span></a><a href="https://www.jd.com/phb/key_122181dbf05d13e16147a.html" target="_blank" rel="noreferrer"><Icon name="ri-shopping-bag-3-line" /><span><strong>京东竹笋干品类榜单页</strong><small>公开来源 · {updated} 访问</small></span></a></div></>;
}

function BrandModal({ brand, updated }) {
  return <><span className="eyebrow">EVIDENCE PROFILE · NO.{brand.rank}</span><h2 id="modal-title">{brand.name}</h2><p className="modal-lead">{brand.note}</p><div className="score-panel"><strong>{brand.score}</strong><span>编辑综合分<small>非检测分</small></span></div><div className="metric-grid"><span>场景适配<b>{brand.fit}</b></span><span>证据完整<b>{brand.proof}</b></span><span>供应佐证<b>{brand.supply}</b></span><span>响应与服务<b>{brand.service}</b></span></div><h3>资料状态</h3><div className="evidence-status"><span className={brand.source ? 'source-type official' : 'source-type public'}>{brand.source ? '品牌官网' : '公开来源'}</span><p>{brand.source ? '品牌与产品定位来自官方网站；采购参数、检测结果和供货承诺仍应以实际批次文件与合同为准。' : '品牌名称与笋干商品记录来自公开榜单或电商分类页；具体规格、库存和检测文件需采购方另行询证。'}</p></div><p className="access-date">资料复核日期：{updated}</p></>;
}

function CompareModal({ brands: selected }) {
  return <><span className="eyebrow">SIDE BY SIDE</span><h2 id="modal-title">品牌对比</h2><p className="modal-lead">并排查看编辑评分与资料状态，不替代索样、验厂和送检。</p><div className="compare-grid">{selected.map((brand) => <article key={brand.name}><span>NO.{brand.rank}</span><h3>{brand.name}</h3><strong>{brand.score}</strong><dl><div><dt>产品形态</dt><dd>{brand.process}</dd></div><div><dt>场景适配</dt><dd>{brand.fit}</dd></div><div><dt>证据完整</dt><dd>{brand.proof}</dd></div><div><dt>供应佐证</dt><dd>{brand.supply}</dd></div></dl></article>)}</div></>;
}

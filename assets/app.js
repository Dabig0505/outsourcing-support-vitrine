(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const countries = {
    fr: {name:'France',slug:'france',office:'Paris',phone:'+33 6 61 08 77 72',tel:'+33661087772',where:'Intervenants à Paris, pilotage depuis Paris.'},
    ma: {name:'Maroc',slug:'maroc',office:'Casablanca',phone:'+212 5 20 11 00 18',tel:'+212520110018',where:'Intervenants à Casablanca, pilotage depuis Paris.'}
  };
  const needs = {
    maintenance:{name:'Maintenance',longName:'Maintenance informatique',index:'01',description:'Entretien des postes et du matériel, dépannage sur site et à distance.',engagement:'Contrat annuel pour la maintenance ; à l’intervention ou au forfait pour le dépannage.',points:['Maintenance préventive des postes et remplacement du matériel défectueux en bureaux.','Diagnostic et résolution de pannes informatiques, réseau et imprimantes sur site.']},
    infogerance:{name:'Infogérance',longName:'Infogérance IT',index:'02',description:'Gestion quotidienne de votre informatique et support de vos utilisateurs.',engagement:'Contrat annuel.',points:['Support utilisateurs à distance et sur site dans le cadre d’un contrat annuel.','Gestion des comptes utilisateurs, des mises à jour et suivi des sauvegardes.']},
    deploiement:{name:'Déploiement',longName:'Déploiement IT',index:'03',description:'Préparation, installation et configuration de postes et d’équipements, à l’ouverture d’un site ou au renouvellement d’un parc.',engagement:'À l’intervention ou au forfait.',points:['Préparation, installation et configuration de postes lors de l’ouverture de bureaux.','Renouvellement d’un parc avec migration des données et installation des logiciels.']},
    audit:{name:'Audit IT & ITGC',longName:'Audit IT & ITGC',index:'04',description:'Revue de vos contrôles informatiques par un auditeur certifié CISA, avec restitution des écarts et recommandations.',engagement:'À l’intervention ou au forfait.',points:['Revue des accès utilisateurs et administrateurs avec identification des droits à supprimer ou modifier.','Évaluation des contrôles de gestion des changements et des sauvegardes, restitution des écarts et recommandations.']}
  };
  function fromURL(){
    const url=new URL(location.href);
    const country=/^\/maroc(?:\/|$)/.test(url.pathname)?'ma':'fr';
    const requested=url.searchParams.get('besoin');
    return {country,need:Object.hasOwn(needs,requested)?requested:'infogerance'};
  }
  let state=fromURL();
  function render(){
    const c=countries[state.country], n=needs[state.need];
    const textMap={countryUpper:'· '+c.name.toLocaleUpperCase('fr'),visualOffice:'Intervenants · '+c.office,contactCountry:c.name};
    $$('[data-text]').forEach(el=>el.textContent=textMap[el.dataset.text]);
    $$('[data-country]').forEach(el=>{
      const active=el.dataset.country===state.country;
      if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(active));
      else {el.href='/'+countries[el.dataset.country].slug+'/?besoin='+state.need;if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}
    });
    $$('[data-need]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.need===state.need)));
    $('#result-country').textContent=c.name.toLocaleUpperCase('fr');
    $('.result-index').textContent=n.index+' /';
    $('#result-title').textContent=n.longName;
    $('#result-description').textContent=n.description+' '+c.where;
    $('#result-list').replaceChildren(...n.points.map(p=>{const li=document.createElement('li');li.textContent=p;return li;}));
    $('#result-engagement').textContent=n.engagement;
    $('#contact-phone').textContent=c.phone;
    $('#contact-phone').href='tel:'+c.tel;
    $('.contact-ma').hidden=state.country==='ma';
    document.title='Outsourcing Support '+c.name+' — Techniciens de terrain pour vos interventions IT';
    $('meta[name="description"]').content='Maintenance, infogérance, déploiement et audit IT & ITGC en '+c.name+'. Équipe pilotée depuis Paris, intervenants à '+c.office+'. Plus de 6 000 interventions par an, 11 techniciens, prise en charge sous 4 h ouvrées.';
  }
  function change(values){
    state={...state,...values};
    history.pushState({},'','/'+countries[state.country].slug+'/?besoin='+state.need+location.hash);
    render();
  }
  $$('[data-country]').forEach(el=>el.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();change({country:el.dataset.country});
  }));
  $$('[data-need]').forEach(el=>el.addEventListener('click',()=>change({need:el.dataset.need})));
  $$('[data-select-need]').forEach(el=>el.addEventListener('click',()=>{
    change({need:el.dataset.selectNeed});
    $('#parcours').scrollIntoView({behavior:'instant',block:'start'});
    $('#result-title').setAttribute('tabindex','-1');
    $('#result-title').focus({preventScroll:true});
  }));
  window.addEventListener('popstate',()=>{state=fromURL();render();});
  const menuToggle=$('.menu-toggle'), menu=$('#mobile-menu');
  function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Ouvrir le menu');}
  menuToggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
  $$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(innerWidth>900)closeMenu();});
  const privacy=$('#privacy-dialog');
  $('#privacy-open').addEventListener('click',()=>privacy.showModal());
  $('.dialog-close').addEventListener('click',()=>privacy.close());
  privacy.addEventListener('click',event=>{if(event.target===privacy){const r=privacy.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)privacy.close();}});
  render();
})();

(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const countries = {
    fr: {name:'France',slug:'france',office:'Paris',phone:'+33 6 61 08 77 72',tel:'+33661087772',title:'Votre IT avance.<br>Votre activité<br><em>aussi.</em>',description:'Maintenance, infogérance, déploiement et audit IT : un partenaire qui prend soin de votre informatique, pour vous laisser avancer sur l’essentiel.',support:'Un accompagnement à distance, avec un point de contact à Paris.'},
    ma: {name:'Maroc',slug:'maroc',office:'Casablanca',phone:'+212 5 20 11 00 18',tel:'+212520110018',title:'Un IT fiable.<br>Une équipe<br><em>à vos côtés.</em>',description:'À Casablanca et au Maroc, des équipes proches de votre terrain pour maintenir votre parc, accompagner vos utilisateurs et faire évoluer votre informatique.',support:'Des interventions à distance et sur site, selon votre localisation et le périmètre convenu.'}
  };
  const needs = {
    maintenance:{name:'Maintenance',longName:'Maintenance informatique',index:'01',title:'Un parc fiable. Des équipes soutenues.',cta:'Parlons de votre maintenance',next:'Faire le point sur votre parc et les incidents qui freinent vos équipes.',description:{fr:'Prévenir les pannes et assister vos utilisateurs à distance, avec des interventions organisées selon les besoins de votre parc.',ma:'Entretenir votre parc et résoudre les incidents, avec un accompagnement à distance et des interventions sur site à organiser.'},points:['Maintenance préventive des postes et équipements','Assistance aux utilisateurs et traitement des incidents','Suivi des actions et des points de vigilance'],context:'Parlons de votre parc informatique et des difficultés rencontrées par vos utilisateurs.'},
    infogerance:{name:'Infogérance',longName:'Infogérance IT',index:'02',title:'Votre service IT, au quotidien.',cta:'Parlons de votre infogérance',next:'Définir les systèmes à prendre en charge et le niveau d’accompagnement attendu.',description:{fr:'Déléguez la gestion de votre environnement IT à une équipe dédiée à son suivi, avec un accompagnement à distance pour vos collaborateurs.',ma:'Appuyez-vous sur une équipe basée à Casablanca pour gérer votre informatique et coordonner vos besoins à distance ou sur site.'},points:['Gestion et suivi de votre infrastructure','Support aux utilisateurs et coordination des interventions','Points réguliers et priorités d’amélioration'],context:'Parlons de votre environnement informatique et de ce que vous souhaitez déléguer.'},
    deploiement:{name:'Déploiement',longName:'Déploiement IT',index:'03',title:'Votre prochain déploiement, bien préparé.',cta:'Cadrons votre déploiement',next:'Identifier les sites, les équipements concernés et votre calendrier de mise en service.',description:{fr:'Organisez vos nouveaux postes, vos évolutions d’infrastructure ou vos migrations, avec une préparation à distance et un périmètre d’intervention défini.',ma:'Préparez vos nouveaux postes et vos évolutions réseau avec une coordination depuis Casablanca et des interventions terrain planifiées.'},points:['Inventaire des besoins et préparation des équipements','Installation, paramétrage et tests de fonctionnement','Passage de relais et documentation pour vos équipes'],context:'Parlons des postes, des sites ou des infrastructures que vous souhaitez déployer.'},
    audit:{name:'Audit IT & ITGC',longName:'Audit informatique IT & ITGC',index:'04',title:'Des contrôles IT qui se démontrent.',cta:'Échangeons sur votre audit IT',next:'Cadrer les applications, les processus IT et les objectifs de votre audit.',description:{fr:'Une mission d’audit autonome en France, portée par une expertise certifiée CISA, pour évaluer vos risques et la maîtrise de vos contrôles IT.',ma:'Une mission d’audit autonome au Maroc, portée par une expertise certifiée CISA, avec un cadrage adapté à vos systèmes et à vos enjeux.'},points:['Gestion des accès, changements et exploitation IT','Entretiens, collecte de preuves et tests ciblés','Rapport de constats et recommandations priorisées'],context:'Parlons de vos systèmes, de vos contrôles IT et de l’objectif de votre audit.'}
  };
  function fromURL(){
    const url=new URL(location.href);
    const country=/^\/maroc(?:\/|$)/.test(url.pathname)?'ma':'fr';
    const requested=url.searchParams.get('besoin');
    return {country,need:Object.hasOwn(needs,requested)?requested:'infogerance'};
  }
  let state=fromURL();
  let preparedRequest='';
  function render(){
    const c=countries[state.country], n=needs[state.need];
    $('#hero-title').innerHTML=c.title;
    const textMap={countryUpper:'· '+c.name.toLocaleUpperCase('fr'),heroDescription:c.description,visualOffice:c.name+' / '+c.office,contactOffice:'Votre contact · '+c.name};
    $$('[data-text]').forEach(el=>el.textContent=textMap[el.dataset.text]);
    $$('[data-country]').forEach(el=>{
      const active=el.dataset.country===state.country;
      if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(active));
      else {el.href='/'+countries[el.dataset.country].slug+'/?besoin='+state.need;if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}
    });
    $$('[data-need]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.need===state.need)));
    $('#result-country').textContent=c.name.toLocaleUpperCase('fr');
    $('.result-index').textContent=n.index+' /';
    $('#result-title').textContent=n.title;
    $('#result-description').textContent=n.description[state.country];
    $('#result-list').replaceChildren(...n.points.map(p=>{const li=document.createElement('li');li.textContent=p;return li;}));
    $('#result-next').textContent=n.next;
    $('#result-cta').replaceChildren(document.createTextNode(n.cta+' '),Object.assign(document.createElement('span'),{textContent:'↗'}));
    $('#result-cta span').setAttribute('aria-hidden','true');
    $('#result-footnote').textContent=state.need==='audit'?'Audit IT / ITGC autonome · Expertise certifiée CISA':'Périmètre, modalités et engagements définis ensemble.';
    $$('[data-service]').forEach(el=>el.textContent=needs[el.dataset.service].description[state.country]);
    $('#form-country').value=state.country;
    $('#form-need').value=state.need;
    $('#form-context-badge').textContent=c.name+' · '+n.name;
    $('#contact-context').textContent=n.context+' '+c.support;
    $('#contact-phone').textContent=c.phone;
    $('#contact-phone').href='tel:'+c.tel;
    document.title='Outsourcing Support '+c.name+' — Maintenance, infogérance & audit IT';
    $('meta[name="description"]').content='Votre partenaire IT en '+c.name+' : maintenance, infogérance, déploiement et audit IT & ITGC. Expertise CISA. Paris & Casablanca. Plus de 10 ans d’expertise.';
  }
  function change(values,{updateURL=true}={}){
    state={...state,...values};
    if(updateURL){const hash=location.hash;history.pushState({},'','/'+countries[state.country].slug+'/?besoin='+state.need+hash);}
    $('#form-status').hidden=true;
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
  $('#form-country').addEventListener('change',event=>change({country:event.target.value}));
  $('#form-need').addEventListener('change',event=>change({need:event.target.value}));
  window.addEventListener('popstate',()=>{state=fromURL();render();});
  const menuToggle=$('.menu-toggle'), menu=$('#mobile-menu');
  function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Ouvrir le menu');}
  menuToggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
  $$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(innerWidth>900)closeMenu();});
  $('#contact-form').addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget), c=countries[state.country],n=needs[state.need];
    const subject='Demande '+c.name+' — '+n.longName;
    preparedRequest='Bonjour Outsourcing Support,\n\nJe souhaite échanger au sujet de la prestation suivante.\n\nPays : '+c.name+'\nBesoin : '+n.longName+'\nNom et entreprise : '+data.get('name')+'\nE-mail : '+data.get('email')+'\nTaille du parc : '+data.get('size')+'\n\nContexte et échéance :\n'+data.get('message')+'\n\nPérimètre à discuter :\n'+n.points.map(p=>'• '+p).join('\n')+'\n\nPremière étape : '+n.next+'\n\nMerci.';
    $('#form-status').hidden=false;
    $('#request-fallback').hidden=false;
    $('#request-fallback').value=preparedRequest;
    $('#copy-request').textContent='Copier ma demande';
    $('#open-email').href='mailto:commercial@outsourcing-support.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(preparedRequest);
  });
  $('#copy-request').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(preparedRequest);$('#copy-request').textContent='Demande copiée ✓';}
    catch {$('#request-fallback').hidden=false;$('#request-fallback').focus();$('#request-fallback').select();$('#copy-request').textContent='Sélectionnez et copiez le texte ci-dessous';}
  });
  const privacy=$('#privacy-dialog');
  $('#privacy-open').addEventListener('click',()=>privacy.showModal());
  $('.dialog-close').addEventListener('click',()=>privacy.close());
  privacy.addEventListener('click',event=>{if(event.target===privacy){const r=privacy.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)privacy.close();}});
  render();
})();

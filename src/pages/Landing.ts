import { store, StoreEvents } from '../flux/Store';
import { selectBattle, Battle } from '../flux/Actions';
import '../components/Character';

export class LandingPage extends HTMLElement {
  private battles: Battle[] = [];

  constructor() {
    super();
    this.battles = store.getBattles();
    
    // Registrar listener para actualizar la vista cuando cambien las batallas
    store.addListener(StoreEvents.BATTLES_LOADED, this.handleBattlesLoaded.bind(this));
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // Limpieza: eliminar listeners cuando el componente se desconecta
    store.removeListener(StoreEvents.BATTLES_LOADED, this.handleBattlesLoaded.bind(this));
  }

  private handleBattlesLoaded() {
    this.battles = store.getBattles();
    this.render();
  }

  private render() {
    this.innerHTML = `
      <div class="container">
        <div class="header">
          <h1>¡Combates de Hora de Aventura!</h1>
          <p>Elige tu combate favorito y vota por tu personaje preferido</p>
        </div>
        
        <div class="battles-grid">
          ${this.battles.map(battle => this.renderBattleCard(battle)).join('')}
        </div>
      </div>
    `;

    // Añadir event listeners a las tarjetas de batalla
    const battleCards = this.querySelectorAll('.battle-card');
    battleCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        selectBattle(this.battles[index].id);
      });
    });
  }

  private renderBattleCard(battle: Battle): string {
    return `
      <div class="battle-card" data-battle-id="${battle.id}">
        <div class="battle-title">${battle.title}</div>
        <div class="battle-card-content">
          <character-element class="character" position="1"></character-element>
          <div class="vs-badge">VS</div>
          <character-element class="character" position="2"></character-element>
        </div>
      </div>
    `;
  }
}

// Registramos el componente
customElements.define('landing-page', LandingPage);

// Una vez que el componente está definido, añadimos un script para inicializar los personajes
// Esta función se ejecutará después de que el navegador haya procesado los componentes
setTimeout(() => {
  const characterElements = document.querySelectorAll('character-element');
  const battles = store.getBattles();
  
  characterElements.forEach(element => {
    const battleCard = element.closest('.battle-card');
    if (battleCard) {
      const battleId = parseInt(battleCard.getAttribute('data-battle-id') || '0');
      const battle = battles.find(b => b.id === battleId);
      
      if (battle) {
        const position = element.getAttribute('position');
        if (position === '1') {
          (element as any).data = battle.character1;
        } else {
          (element as any).data = battle.character2;
        }
      }
    }
  });
}, 0);
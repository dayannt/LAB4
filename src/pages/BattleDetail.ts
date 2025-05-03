import { store, StoreEvents } from '../flux/Store';
import { navigateToLanding, voteForCharacter } from '../flux/Actions';
import '../components/Character';
import '../components/VotingStats';

export class BattleDetail extends HTMLElement {
  private battleId: number | null = null;
  private votingStats: HTMLElement | null = null;

  static get observedAttributes() {
    return ['battle-id'];
  }

  constructor() {
    super();
    
    // Registrar listener para actualizar cuando cambie la batalla
    store.addListener(StoreEvents.BATTLE_UPDATED, this.handleBattleUpdated.bind(this));
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // Eliminar listeners cuando el componente se desconecte
    store.removeListener(StoreEvents.BATTLE_UPDATED, this.handleBattleUpdated.bind(this));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'battle-id') {
      this.battleId = parseInt(newValue);
      this.render();
    }
  }

  private handleBattleUpdated() {
    const battle = store.getSelectedBattle();
    
    if (battle && this.votingStats) {
      // Actualizar solo las estadísticas sin volver a renderizar todo
      (this.votingStats as any).update(battle);
      
      // Actualizar también el estado de los botones de voto
      const characterElements = this.querySelectorAll('character-element');
      characterElements.forEach(element => {
        element.setAttribute('has-voted', store.hasUserVotedInBattle(battle.id).toString());
      });
    }
  }

  private render() {
    const battle = store.getSelectedBattle();
    
    if (!battle) {
      this.innerHTML = `
        <div class="container">
          <p>Batalla no encontrada.</p>
          <button class="back-button">Volver a la página principal</button>
        </div>
      `;
      
      const backButton = this.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', () => navigateToLanding());
      }
      
      return;
    }

    const hasVoted = store.hasUserVotedInBattle(battle.id);

    this.innerHTML = `
      <div class="container">
        <button class="back-button">← Volver a todos los combates</button>
        
        <div class="battle-detail">
          <div class="battle-header">
            <h2>${battle.title}</h2>
            <p>¡Vota por tu personaje favorito!</p>
          </div>
          
          <div class="characters-container">
            <character-element is-detail="true" position="1" has-voted="${hasVoted}"></character-element>
            <character-element is-detail="true" position="2" has-voted="${hasVoted}"></character-element>
          </div>
          
          <voting-stats></voting-stats>
        </div>
      </div>
    `;

    // Configuramos el botón de volver
    const backButton = this.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => navigateToLanding());
    }

    // Inicializamos los componentes de personaje
    const characterElements = this.querySelectorAll('character-element');
    characterElements.forEach((element, index) => {
      if (index === 0) {
        (element as any).data = battle.character1;
        (element as any).onVote = () => {
          voteForCharacter(battle.id, 1);
        };
      } else {
        (element as any).data = battle.character2;
        (element as any).onVote = () => {
          voteForCharacter(battle.id, 2);
        };
      }
    });

    // Inicializamos las estadísticas de votación
    this.votingStats = this.querySelector('voting-stats');
    if (this.votingStats) {
      (this.votingStats as any).data = battle;
    }
  }
}

// Registramos el componente
customElements.define('battle-detail', BattleDetail);
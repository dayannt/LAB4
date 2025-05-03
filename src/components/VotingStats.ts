import { Battle } from '../flux/Actions';

export class VotingStats extends HTMLElement {
  private battle: Battle | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set data(battle: Battle) {
    this.battle = battle;
    this.render();
  }

  private render() {
    if (!this.battle) return;

    const totalVotes = this.battle.votes1 + this.battle.votes2;
    const percent1 = totalVotes > 0 ? Math.round((this.battle.votes1 / totalVotes) * 100) : 50;
    const percent2 = totalVotes > 0 ? Math.round((this.battle.votes2 / totalVotes) * 100) : 50;
    
    this.innerHTML = `
      <div class="voting-stats">
        <h3>Estadísticas de votación</h3>
        <p>Votos totales: ${totalVotes}</p>
        
        <div class="vote-bars">
          <div class="vote-bar-container">
            <span class="character-label">${this.battle.character1.name}</span>
            <div class="vote-bar">
              <div class="vote-fill character-1-fill" style="width: ${percent1}%">
                ${this.battle.votes1}
              </div>
            </div>
            <span class="vote-percentage">${percent1}%</span>
          </div>
          
          <div class="vote-bar-container">
            <span class="character-label">${this.battle.character2.name}</span>
            <div class="vote-bar">
              <div class="vote-fill character-2-fill" style="width: ${percent2}%">
                ${this.battle.votes2}
              </div>
            </div>
            <span class="vote-percentage">${percent2}%</span>
          </div>
        </div>
      </div>
    `;
  }

  // Método para actualizar los datos sin recrear todo el componente
  public update(battle: Battle) {
    this.battle = battle;
    
    if (!this.isConnected) return;
    
    const totalVotes = battle.votes1 + battle.votes2;
    const percent1 = totalVotes > 0 ? Math.round((battle.votes1 / totalVotes) * 100) : 50;
    const percent2 = totalVotes > 0 ? Math.round((battle.votes2 / totalVotes) * 100) : 50;
    
    const character1Fill = this.querySelector('.character-1-fill') as HTMLElement;
    const character2Fill = this.querySelector('.character-2-fill') as HTMLElement;
    const percentages = this.querySelectorAll('.vote-percentage');
    const votesTotal = this.querySelector('p');
    
    if (character1Fill) {
      character1Fill.style.width = `${percent1}%`;
      character1Fill.textContent = String(battle.votes1);
    }
    
    if (character2Fill) {
      character2Fill.style.width = `${percent2}%`;
      character2Fill.textContent = String(battle.votes2);
    }
    
    if (percentages.length === 2) {
      percentages[0].textContent = `${percent1}%`;
      percentages[1].textContent = `${percent2}%`;
    }
    
    if (votesTotal) {
      votesTotal.textContent = `Votos totales: ${totalVotes}`;
    }
  }
}

// Registramos el componente
customElements.define('voting-stats', VotingStats);
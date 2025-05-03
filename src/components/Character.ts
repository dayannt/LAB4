import { Character as CharacterType } from '../flux/Actions';

export class Character extends HTMLElement {
  private character: CharacterType | null = null;
  private position: 1 | 2 = 1;
  private isInDetail: boolean = false;
  private voteCallback: (() => void) | null = null;
  private hasVoted: boolean = false;

  static get observedAttributes() {
    return ['position', 'is-detail', 'has-voted'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'position') {
      this.position = parseInt(newValue) === 2 ? 2 : 1;
    } else if (name === 'is-detail') {
      this.isInDetail = newValue === 'true';
    } else if (name === 'has-voted') {
      this.hasVoted = newValue === 'true';
    }
    this.render();
  }

  set data(character: CharacterType) {
    this.character = character;
    this.render();
  }

  set onVote(callback: () => void) {
    this.voteCallback = callback;
  }

  private render() {
    if (!this.character) return;

    if (this.isInDetail) {
      this.renderDetailView();
    } else {
      this.renderCardView();
    }
  }

  private renderCardView() {
    this.className = 'character';
    this.innerHTML = `
      <img class="character-img" src="${this.character?.image}" alt="${this.character?.name}">
      <div class="character-name">${this.character?.name}</div>
    `;
  }

  private renderDetailView() {
    this.className = 'character-detail';
    this.innerHTML = `
      <img src="${this.character?.image}" alt="${this.character?.name}">
      <h3>${this.character?.name}</h3>
      <button class="vote-button" ${this.hasVoted ? 'disabled' : ''}>
        ${this.hasVoted ? '¡Ya has votado!' : 'Votar por este personaje'}
      </button>
    `;

    const voteButton = this.querySelector('.vote-button');
    if (voteButton && !this.hasVoted && this.voteCallback) {
      voteButton.addEventListener('click', this.voteCallback);
    }
  }
}

// Registramos el componente
customElements.define('character-element', Character);
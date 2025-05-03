import { store, StoreEvents } from '../flux/Store';
import { loadBattles, Battle } from '../flux/Actions';
import '../pages/Landing';
import '../pages/BattleDetail';

export class AppContainer extends HTMLElement {
  private currentPage: HTMLElement | null = null;

  constructor() {
    super();
    
    // Inicializar el estado y registrar listeners
    this.initializeStore();
    this.setupListeners();

    // Cargar las batallas iniciales (simuladas)
    this.loadInitialBattles();
  }

  connectedCallback() {
    this.renderLandingPage();
  }

  private setupListeners() {
    // Escuchar cambios en la selección de batalla
    store.addListener(StoreEvents.BATTLE_SELECTED, () => {
      const selectedBattle = store.getSelectedBattle();
      if (selectedBattle) {
        this.renderBattleDetailPage(selectedBattle.id);
      }
    });

    // Escuchar cuando se debe navegar de vuelta a la landing page
    store.addListener(StoreEvents.NAVIGATE_TO_LANDING, () => {
      this.renderLandingPage();
    });
  }

  private initializeStore() {
    // Verificar si ya hay batallas guardadas en localStorage
    const storedBattles = localStorage.getItem('battles');
    if (!storedBattles) {
      // Si no hay batallas guardadas, inicializamos con batallas por defecto
      const initialBattles = this.getInitialBattles();
      localStorage.setItem('battles', JSON.stringify(initialBattles));
    }
  }

  private loadInitialBattles() {
    // Cargar batallas desde localStorage
    const battles = JSON.parse(localStorage.getItem('battles') || '[]');
    loadBattles(battles);
  }

  private renderLandingPage() {
    if (this.currentPage) {
      this.removeChild(this.currentPage);
    }
    
    const landingPage = document.createElement('landing-page');
    this.appendChild(landingPage);
    this.currentPage = landingPage;
  }

  private renderBattleDetailPage(battleId: number) {
    if (this.currentPage) {
      this.removeChild(this.currentPage);
    }
    
    const detailPage = document.createElement('battle-detail');
    detailPage.setAttribute('battle-id', battleId.toString());
    this.appendChild(detailPage);
    this.currentPage = detailPage;
  }

  private getInitialBattles(): Battle[] {
    // Datos iniciales de batallas con personajes de Hora de Aventura
    return [
      {
        id: 1,
        title: "¡Batalla épica por la Tierra de Ooo!",
        character1: {
          id: 1,
          name: "Finn el humano",
          image: "https://via.placeholder.com/300x300?text=Finn"
        },
        character2: {
          id: 2,
          name: "Jake el perro",
          image: "https://via.placeholder.com/300x300?text=Jake"
        },
        votes1: 42,
        votes2: 38
      },
      {
        id: 2,
        title: "¡Duelo de realeza!",
        character1: {
          id: 3,
          name: "Princesa Flama",
          image: "https://via.placeholder.com/300x300?text=Princesa+Flama"
        },
        character2: {
          id: 4,
          name: "Dulce Princesa",
          image: "https://via.placeholder.com/300x300?text=Dulce+Princesa"
        },
        votes1: 25,
        votes2: 30
      },
      {
        id: 3,
        title: "¡Batalla de villanos!",
        character1: {
          id: 5,
          name: "Rey Helado",
          image: "https://via.placeholder.com/300x300?text=Rey+Helado"
        },
        character2: {
          id: 6,
          name: "Lich",
          image: "https://via.placeholder.com/300x300?text=Lich"
        },
        votes1: 19,
        votes2: 45
      },
      {
        id: 4,
        title: "¡Competencia de música!",
        character1: {
          id: 7,
          name: "Marceline",
          image: "https://via.placeholder.com/300x300?text=Marceline"
        },
        character2: {
          id: 8,
          name: "BMO",
          image: "https://via.placeholder.com/300x300?text=BMO"
        },
        votes1: 50,
        votes2: 48
      },
      {
        id: 5,
        title: "¡Duelo de princesas!",
        character1: {
          id: 9,
          name: "Princesa Grumosa",
          image: "https://via.placeholder.com/300x300?text=Princesa+Grumosa"
        },
        character2: {
          id: 10,
          name: "Princesa Desayuno",
          image: "https://via.placeholder.com/300x300?text=Princesa+Desayuno"
        },
        votes1: 33,
        votes2: 22
      },
      {
        id: 6,
        title: "¡Batalla de artes marciales!",
        character1: {
          id: 11,
          name: "Susana Salvaje",
          image: "https://via.placeholder.com/300x300?text=Susana+Salvaje"
        },
        character2: {
          id: 12,
          name: "Rattleballs",
          image: "https://via.placeholder.com/300x300?text=Rattleballs"
        },
        votes1: 17,
        votes2: 26
      },
      {
        id: 7,
        title: "¡Duelo de ciencia!",
        character1: {
          id: 13,
          name: "Princesa Chicle",
          image: "https://via.placeholder.com/300x300?text=Princesa+Chicle"
        },
        character2: {
          id: 14,
          name: "Tronquitos",
          image: "https://via.placeholder.com/300x300?text=Tronquitos"
        },
        votes1: 27,
        votes2: 12
      },
      {
        id: 8,
        title: "¡Batalla subterránea!",
        character1: {
          id: 15,
          name: "Gunter",
          image: "https://via.placeholder.com/300x300?text=Gunter"
        },
        character2: {
          id: 16,
          name: "Conde Limoncio",
          image: "https://via.placeholder.com/300x300?text=Conde+Limoncio"
        },
        votes1: 41,
        votes2: 15
      }
    ];
  }
}

// Registramos el componente
customElements.define('app-container', AppContainer);
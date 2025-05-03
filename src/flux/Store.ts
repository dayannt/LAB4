import { dispatcher } from './Dispatcher';
import { ActionTypes, Battle } from './Actions';

// Definimos los eventos que puede emitir nuestro Store
export enum StoreEvents {
  BATTLES_LOADED = 'BATTLES_LOADED',
  BATTLE_UPDATED = 'BATTLE_UPDATED',
  BATTLE_SELECTED = 'BATTLE_SELECTED',
  NAVIGATE_TO_LANDING = 'NAVIGATE_TO_LANDING'
}

type StoreEventListener = () => void;

class Store {
  private battles: Battle[];
  private selectedBattleId: number | null;
  private listeners: Map<StoreEvents, StoreEventListener[]>;
  private static instance: Store;

  private constructor() {
    this.battles = [];
    this.selectedBattleId = null;
    this.listeners = new Map();

    // Registramos este Store con el Dispatcher
    dispatcher.register('BattleStore', this.handleAction.bind(this));

    // Inicializamos los listeners para cada tipo de evento
    Object.values(StoreEvents).forEach(event => {
      this.listeners.set(event, []);
    });
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  // Método para manejar las acciones del Dispatcher
  private handleAction(action: any): void {
    switch (action.type) {
      case ActionTypes.LOAD_BATTLES:
        this.battles = action.battles;
        this.emitChange(StoreEvents.BATTLES_LOADED);
        break;

      case ActionTypes.VOTE_CHARACTER:
        const battleIndex = this.battles.findIndex(b => b.id === action.battle.id);
        if (battleIndex !== -1) {
          this.battles[battleIndex] = action.battle;
          this.emitChange(StoreEvents.BATTLE_UPDATED);
        }
        break;

      case ActionTypes.SELECT_BATTLE:
        this.selectedBattleId = action.battleId;
        this.emitChange(StoreEvents.BATTLE_SELECTED);
        break;

      case ActionTypes.NAVIGATE_TO_LANDING:
        this.selectedBattleId = null;
        this.emitChange(StoreEvents.NAVIGATE_TO_LANDING);
        break;

      default:
        // Ignoramos acciones desconocidas
    }
  }

  // Método para registrar listeners de eventos
  public addListener(event: StoreEvents, callback: StoreEventListener): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }

  // Método para eliminar listeners de eventos
  public removeListener(event: StoreEvents, callback: StoreEventListener): void {
    const eventListeners = this.listeners.get(event) || [];
    const index = eventListeners.indexOf(callback);
    if (index !== -1) {
      eventListeners.splice(index, 1);
      this.listeners.set(event, eventListeners);
    }
  }

  // Método para notificar a los listeners de un evento
  private emitChange(event: StoreEvents): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => listener());
  }

  // Getters para acceder a los datos del Store
  public getBattles(): Battle[] {
    return [...this.battles];
  }

  public getSelectedBattle(): Battle | null {
    if (this.selectedBattleId === null) return null;
    return this.battles.find(battle => battle.id === this.selectedBattleId) || null;
  }

  public getSelectedBattleId(): number | null {
    return this.selectedBattleId;
  }

  public hasUserVotedInBattle(battleId: number): boolean {
    const votedBattles = JSON.parse(localStorage.getItem('votedBattles') || '[]');
    return votedBattles.includes(battleId);
  }
}

// Exportamos una instancia única del Store
export const store = Store.getInstance();
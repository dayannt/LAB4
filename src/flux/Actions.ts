import { dispatcher } from './Dispatcher';

// Definimos los tipos de acciones disponibles en nuestra aplicación
export enum ActionTypes {
  LOAD_BATTLES = 'LOAD_BATTLES',
  VOTE_CHARACTER = 'VOTE_CHARACTER',
  SELECT_BATTLE = 'SELECT_BATTLE',
  NAVIGATE_TO_LANDING = 'NAVIGATE_TO_LANDING'
}

// Interface para los datos de un personaje
export interface Character {
  id: number;
  name: string;
  image: string;
}

// Interface para los datos de una batalla
export interface Battle {
  id: number;
  title: string;
  character1: Character;
  character2: Character;
  votes1: number;
  votes2: number;
}

// Acciones para cargar las batallas
export const loadBattles = (battles: Battle[]): void => {
  dispatcher.dispatch({
    type: ActionTypes.LOAD_BATTLES,
    battles
  });
};

// Acción para votar por un personaje
export const voteForCharacter = (battleId: number, characterPosition: 1 | 2): void => {
  // Simulamos una llamada a una API
  simulateApiCall(battleId, characterPosition)
    .then((updatedBattle) => {
      dispatcher.dispatch({
        type: ActionTypes.VOTE_CHARACTER,
        battle: updatedBattle
      });
    })
    .catch((error) => {
      console.error('Error al votar:', error);
    });
};

// Acción para seleccionar una batalla y navegar a su detalle
export const selectBattle = (battleId: number): void => {
  dispatcher.dispatch({
    type: ActionTypes.SELECT_BATTLE,
    battleId
  });
};

// Acción para navegar a la página principal
export const navigateToLanding = (): void => {
  dispatcher.dispatch({
    type: ActionTypes.NAVIGATE_TO_LANDING
  });
};

// Función auxiliar para simular una llamada a la API
function simulateApiCall(battleId: number, characterPosition: 1 | 2): Promise<Battle> {
  return new Promise((resolve) => {
    // Simulamos un retraso de red
    setTimeout(() => {
      const storedBattles = JSON.parse(localStorage.getItem('battles') || '[]');
      const battleIndex = storedBattles.findIndex((b: Battle) => b.id === battleId);
      
      if (battleIndex !== -1) {
        const battle = storedBattles[battleIndex];
        
        // Verificamos si el usuario ya ha votado en esta batalla
        const votedBattles = JSON.parse(localStorage.getItem('votedBattles') || '[]');
        const hasVoted = votedBattles.includes(battleId);
        
        if (!hasVoted) {
          // Actualizamos los votos
          if (characterPosition === 1) {
            battle.votes1 += 1;
          } else {
            battle.votes2 += 1;
          }
          
          // Actualizamos la batalla en el almacenamiento
          storedBattles[battleIndex] = battle;
          localStorage.setItem('battles', JSON.stringify(storedBattles));
          
          // Registramos que el usuario ha votado en esta batalla
          votedBattles.push(battleId);
          localStorage.setItem('votedBattles', JSON.stringify(votedBattles));
        }
        
        resolve(battle);
      } else {
        throw new Error(`Batalla con ID ${battleId} no encontrada`);
      }
    }, 500); // Simulamos 500ms de latencia
  });
}
/* eslint-disable no-underscore-dangle */
import { SearchParams, Ship, ShipSimple } from '_/types/types';
import { fleets } from '../data/categories';

/**
 * @class Ship data store wrapper.
 */
export default class DataStore {
  private shipsArr: Ship[] = [];

  private count = 0;

  private state: 'INIT' | 'READY' | 'UPDATING' = 'INIT';

  /**
   * Constructor for DataStore
   * @param shipData Ship data json.
   */
  constructor(ships?: Ship[]) {
    if (ships) {
      this.shipsArr = [...ships.slice()];
      this.count = ships.length;
    } else {
      this.shipsArr = [];
      this.count = 0;
    }
    this.state = 'INIT';
  }

  getShips(): Ship[] {
    return this.shipsArr;
  }

  getShipByIndex(index: number): Ship | undefined {
    return this.shipsArr[index];
  }

  async setArray(data: Ship[]): Promise<Ship[]> {
    try {
      this.shipsArr = [...data.slice()];
      this.count = data.length;
    } catch (error) {
      return Promise.reject(new Error('Failed to set array in DataStore.'));
    }
    this.state = 'READY';
    return Promise.resolve(data);
  }

  /**
   * Returns shop count based on category parameters.
   * @param searchPs Search parameters
   */
  async getShipsByParams(searchPs: SearchParams): Promise<ShipSimple[]> {
    let t: ShipSimple[] = [];
    try {
      t = this.shipsArr.reduce<ShipSimple[]>((acc, item, index): ShipSimple[] => {
        if (DataStore._filterPredicate(searchPs, item)) {
          acc.push({ id: item.id, index });
        }
        return acc;
      }, []);
    } catch (error) {
      return Promise.reject(new Error('Failed to get ships by params in DataStore.'));
    }
    return Promise.resolve(t);
  }

  /**
   * Private function for class DataStore filtering.
   * @param searchPs Paraemters to use in filtering.
   * @param ship Current ship.
   */
  // eslint-disable-next-line no-underscore-dangle
  static _filterPredicate(searchPs: SearchParams, ship: Ship): boolean {
    let isNameMatch = false;
    let isNatMatch = false;
    let isHullMatch = false;
    let isRarityMatch = false;
    isNameMatch = ship.names.en.toLowerCase().includes(searchPs.name.toLowerCase());

    if (ship.nationality) {
      isNatMatch = searchPs.nationality.All ? true : searchPs.nationality[ship.nationality];
    }
    // Fleet check if used in the formation view to limit ships to Main or Vanguard.
    if (ship.hullType && searchPs.fleet === 'ALL') {
      isHullMatch = searchPs.hullType.All ? true : searchPs.hullType[ship.hullType];
    } else if (ship.hullType && searchPs.fleet === 'MAIN' && fleets.MAIN.includes(ship.hullType)) {
      isHullMatch = searchPs.hullType.All ? true : searchPs.hullType[ship.hullType];
    } else if (ship.hullType && searchPs.fleet === 'VANGUARD' && fleets.VANGUARD.includes(ship.hullType)) {
      isHullMatch = searchPs.hullType.All ? true : searchPs.hullType[ship.hullType];
    }
    if (ship.rarity) {
      isRarityMatch = searchPs.rarity.All ? true : searchPs.rarity[ship.rarity];
    }
    return isNameMatch && isNatMatch && isHullMatch && isRarityMatch;
  }

  static transformShipList(data: Ship[]): ShipSimple[] {
    let t: ShipSimple[] = [];
    t = [
      ...data.map((element, index) => ({
        id: element.id,
        index,
      })),
    ];
    return t;
  }

  static transformStringList(shipData: Ship[], data: string[]): ShipSimple[] {
    let t: ShipSimple[] = [];
    t = [...data.map((element) => ({ id: element, index: shipData.findIndex((ele) => ele.id === element) }))];
    return t;
  }

  static async reduceByParams(shipData: DataStore, list: ShipSimple[], searchPs: SearchParams): Promise<ShipSimple[]> {
    let t: ShipSimple[] = [];
    try {
      t = list.reduce<ShipSimple[]>((acc, item): ShipSimple[] => {
        if (DataStore._filterPredicate(searchPs, shipData.shipsArr[item.index])) {
          acc.push({ id: item.id, index: item.index });
        }
        return acc;
      }, []);
    } catch (error) {
      return Promise.reject(new Error('Failed to reduce by params in DataStore.'));
    }
    return Promise.resolve(t);
  }
}

import { SearchParams, Ship, ShipSimple } from './types';
import { fleets } from '../data/categories';

/**
 * @class Ship data wrapper.
 */
export default class DataStore {
  shipsArr: Ship[] = [];
  count = 0;
  state: 'INIT' | 'READY' | 'UPDATING' = 'INIT';
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

  getShipByIndex(index: number): Ship | undefined {
    return this.shipsArr[index];
  }

  /**
   * Function returns a ship by given id.
   * @param {string} id Ship id.
   * @returns {Ship | undefined} Ship details.
   */
  getShipById(id: string): Ship | undefined {
    if (id === '') return undefined;
    return this.shipsArr.find((ship) => ship.id === id);
  }

  async setArray(data: Ship[]): Promise<Ship[]> {
    try {
      this.shipsArr = [...data.slice()];
      this.count = data.length;
    } catch (error) {
      return Promise.reject(new Error(error.message));
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
          acc.push({ id: item.id, index: index });
        }
        return acc;
      }, []);
    } catch (error) {
      return Promise.reject(new Error(error.message));
    }
    return Promise.resolve(t);
  }

  /**
   * Private function for class DataStore filtering.
   * @param searchPs Paraemters to use in filtering.
   * @param ship Current ship.
   */
  static _filterPredicate(searchPs: SearchParams, ship: Ship): boolean {
    let isNameMatch = false;
    let isNatMatch = false;
    let isHullMatch = false;
    let isRarityMatch = false;
    isNameMatch = ship.names.en.toLowerCase().includes(searchPs.name.toLowerCase());

    if (ship.nationality) {
      isNatMatch = searchPs.nationality['All'] ? true : searchPs.nationality[ship.nationality];
    }
    // Fleet check if used in the formation view to limit ships to Main or Vanguard.
    if (ship.hullType && searchPs.fleet === 'ALL') {
      isHullMatch = searchPs.hullType['All'] ? true : searchPs.hullType[ship.hullType];
    } else if (ship.hullType && searchPs.fleet === 'MAIN' && fleets.MAIN.includes(ship.hullType)) {
      isHullMatch = searchPs.hullType['All'] ? true : searchPs.hullType[ship.hullType];
    } else if (ship.hullType && searchPs.fleet === 'VANGUARD' && fleets.VANGUARD.includes(ship.hullType)) {
      isHullMatch = searchPs.hullType['All'] ? true : searchPs.hullType[ship.hullType];
    }
    if (ship.rarity) {
      isRarityMatch = searchPs.rarity['All'] ? true : searchPs.rarity[ship.rarity];
    }
    return isNameMatch && isNatMatch && isHullMatch && isRarityMatch;
  }

  static transformShipList(data: Ship[]): ShipSimple[] {
    let t: ShipSimple[] = [];
    t = [
      ...data.map((element, index) => ({
        id: element.id,
        index: index,
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
      return Promise.reject(new Error(error.message));
    }
    return Promise.resolve(t);
  }
}

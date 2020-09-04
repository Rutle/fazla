import { Ship, ShipSimple } from './shipdatatypes';
import { SearchParams } from '../reducers/slices/searchParametersSlice';

export interface RarityParam {
  [key: string]: boolean;
}

export interface NationalityParam {
  [key: string]: boolean;
}

export interface HullTypeParam {
  [key: string]: boolean;
}

/**
 * Ship data wrapper.
 */
export default class DataStore {
  shipsArr: Ship[] = [];
  count = 0;
  init: 'INIT' | 'READY' | 'UPDATING' = 'INIT';
  /**
   * Constructor for DataStore
   * @param shipData Ship data json.
   */
  constructor(shipData: Ship[]) {
    this.shipsArr = [...shipData];
    this.count = shipData.length;
    this.init = 'INIT';
  }

  getShipById(id: string): Ship | undefined {
    if (id === '') return undefined;
    return this.shipsArr.find((ship) => ship.id === id);
  }

  async setArray(data: Ship[]): Promise<Ship[]> {
    try {
      this.shipsArr = [...data];
      this.count = this.shipsArr.length;
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    this.init = 'READY';
    return await Promise.resolve(data);
  }

  /**
   * Returns shop count based on category parameters.
   * @param searchPs Search parameters
   */
  async getShipsByParams(searchPs: SearchParams): Promise<ShipSimple[]> {
    let t: ShipSimple[] = [];
    console.log(searchPs);
    try {
      t = this.shipsArr.reduce<ShipSimple[]>((acc, item, index): ShipSimple[] => {
        if (DataStore._filterPredicate(searchPs, item)) {
          acc.push({ id: item.id, index: index });
        }
        return acc;
      }, []);
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    return await Promise.resolve(t);
  }

  /**
   * Private function for class DataStore filtering.
   * @param searchPs Paraemters to use in filtering.
   * @param ship Current ship.
   */
  static _filterPredicate(searchPs: SearchParams, ship: Ship): boolean {
    let isNameMatch = false;
    let isNatMatch = true;
    let isHullMatch = true;
    let isRarityMatch = true;
    isNameMatch = ship.names.en.toLowerCase().includes(searchPs.name.toLowerCase());
    if (ship.nationality) {
      isNatMatch = searchPs.nationality['All'] ? true : searchPs.nationalityArr.includes(ship.nationality);
    } else {
      isNatMatch = false;
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
    t = [...data.map((element, index) => ({ id: element, index: shipData.findIndex((ele) => ele.id === element) }))];
    return t;
  }

  static async reduceByParams(shipData: DataStore, list: ShipSimple[], searchPs: SearchParams): Promise<ShipSimple[]> {
    let t: ShipSimple[] = [];
    try {
      t = list.reduce<ShipSimple[]>((acc, item, index): ShipSimple[] => {
        if (DataStore._filterPredicate(searchPs, shipData.shipsArr[item.index])) {
          acc.push({ id: item.id, index: item.index });
        }
        return acc;
      }, []);
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    return await Promise.resolve(t);
  }
}

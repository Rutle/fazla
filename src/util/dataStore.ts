import { Ship, ShipSimple } from './shipdatatypes';
import { SearchParams } from '../reducers/slices/searchParametersSlice';

export interface ShipJson {
  [key: string]: Ship;
}

export interface SimpleShipJson {
  [key: string]: ShipSimple;
}

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
    return isNameMatch && isNatMatch && isHullMatch && isRarityMatch;
  }
  /*
  async _getShipsByRarity(shipData: Ship[], rarity: RarityParam | undefined): Promise<Ship[]> {
    if (rarity === undefined) return await Promise.resolve(shipData);
    let rarityShips: Ship[] = [];
    try {
      // return searchParameters.rarity[ele.rarity as string];
      rarityShips = shipData.filter((ele) => rarity[ele.rarity as string]);
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    return await Promise.resolve(rarityShips);
  }

  async _getShipsByNationality(shipData: Ship[], nationality: NationalityParam | undefined): Promise<Ship[]> {
    if (nationality === undefined) return await Promise.resolve(shipData);
    let nationalityShips: Ship[] = [];
    try {
      nationalityShips = shipData.filter((ele) => nationality[ele.nationality as string]);
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    return await Promise.resolve(nationalityShips);
  }

  async _getShipsByHullType(shipData: Ship[], hullType: HullTypeParam | undefined): Promise<Ship[]> {
    if (hullType === undefined) return await Promise.resolve(shipData);
    let hullTypeShips: Ship[] = [];
    try {
      hullTypeShips = shipData.filter((ele) => hullType[ele.hullType as string]);
    } catch (error) {
      return await Promise.reject(new Error(error.message));
    }
    return await Promise.resolve(hullTypeShips);
  }
  */

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

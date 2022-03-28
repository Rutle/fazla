/* eslint-disable no-underscore-dangle */
import { Equipment } from '_/types/equipmentTypes';
import { Ship } from '_/types/shipTypes';
import { SearchParams, ShipSimple } from '_/types/types';
import { fleets, eqTypes } from '../data/categories';

/**
 * @class Ship data store wrapper.
 */
export default class DataStore {
  private shipsArr: Ship[] = [];

  private eqArr: Equipment[] = [];

  private eqMap: Record<string, Equipment> = {};

  private eqByType: Record<string, Equipment[]> = {};

  private eqIds: Record<string, string> = {};

  // To prevent unnecessary array/object manipulations when saving selected equipment
  // for a ship slot.
  private reverseEqId: Record<string, string> = {};

  private shipCount = 0;

  private eqCount = 0;

  private state: 'INIT' | 'READY' | 'UPDATING' = 'INIT';

  /**
   * Constructor for DataStore
   */
  constructor(ships?: Ship[], eqs?: Equipment[]) {
    if (ships && eqs) {
      this.shipsArr = [...ships.slice()];
      this.eqArr = [...eqs.slice()];
      this.shipCount = ships.length;
      this.eqCount = eqs.length;
    } else {
      this.shipsArr = [];
      this.eqArr = [];
      this.shipCount = 0;
      this.eqCount = 0;
    }
    this.state = 'INIT';
  }

  getShips(): Ship[] {
    return this.shipsArr;
  }

  getEqs(): Equipment[] {
    return this.eqArr;
  }

  getShipByIndex(index: number): Ship | undefined {
    return this.shipsArr[index];
  }

  getEqsByType(type: string): Equipment[] {
    if (Object.keys(this.eqByType).includes(type)) return this.eqByType[type];
    return [];
  }

  getEqNameByCustomId(id: string): string {
    // TODO: Make this return the .names.en value
    // Remove getEqNameByLongId-call from formation equipment text field
    // Or just return the Equipment object.
    if (Object.keys(this.eqIds).includes(id)) return this.eqMap[this.eqIds[id]].names.en;
    return '-';
  }

  getEqCustomId(longId: string): string {
    if (Object.keys(this.reverseEqId).includes(longId)) return this.reverseEqId[longId];
    return '-';
  }

  async setCustomEqIds(data: { [key: string]: string }): Promise<void> {
    try {
      this.eqIds = { ...data };

      // Form another "map" that contains values from data as keys
      // and keys from data as values. The original raw data contains long names as IDs
      // which we don't want to use because when we are exporting formation
      // data the resulting string size becomes much larger. We use short customs IDs.
      // Do the one time array/object manipulation here rather than doing
      // array/manipulation everytime we need to get shorther Id.
      this.reverseEqId = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          // const keyNumber = Number(key);
          return [value, key];
        })
      );
    } catch (error) {
      return Promise.reject(new Error('Failed to set custom IDs data in DataStore.'));
    }
    return Promise.resolve();
  }

  async setShips(data: Ship[]): Promise<Ship[]> {
    try {
      this.shipsArr = [...data.slice()];
      this.shipCount = data.length;
    } catch (error) {
      return Promise.reject(new Error('Failed to set ship data in DataStore.'));
    }
    this.state = 'READY';
    return Promise.resolve(data);
  }

  async setEqs(data: Equipment[]): Promise<Equipment[]> {
    try {
      this.eqArr = [...data.slice()];
      this.eqCount = data.length;
      // Parse equipment data into a "map" with type as a key and all equipment names as value array.
      this.eqByType = Object.values(eqTypes).reduce(
        (a, c) =>
          Object.assign(a, {
            [c]: this.eqArr.filter((value) => value.type.name === c),
          }),
        {} as Record<string, Equipment[]>
      );

      this.eqMap = Object.fromEntries(this.eqArr.map((v) => [v.id, v]));
    } catch (error) {
      return Promise.reject(new Error('Failed to set equipment data in DataStore.'));
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
    } else if (ship.hullType && searchPs.fleet === 'SUBMARINE' && fleets.SUBS.includes(ship.hullType)) {
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

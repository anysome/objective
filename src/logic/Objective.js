/**
 * Created by Layman(http://github.com/anysome) on 16/2/29.
 */

import {L} from '../app';

const colors = {
  priority1: "#55EFCB",
  priority2: "#1D77EF",
  priority3: "#FF3B30",
  priority0: "#D2CFD0"
};

const unit = new Map();
unit.set('0', L('objective.unit.check'));
unit.set('1', L('objective.unit.tomato'));
unit.set('3', L('objective.unit.piece'));
unit.set('4', L('objective.unit.km'));
unit.set('5', L('objective.unit.item'));
unit.set('2', L('objective.unit.paper'));

const priority = new Map();
priority.set(0, L('objective.priority.none'));
priority.set(1, L('objective.priority.ordinary'));
priority.set(2, L('objective.priority.medium'));
priority.set(3, L('objective.priority.emphasis'));
priority.set(8, L('objective.priority.emergency'));
priority.set(9, L('objective.priority.frog'));

const frequency = new Map();
frequency.set('1', L('objective.frequency.daily'));
frequency.set('2', L('objective.frequency.weekly'));
frequency.set('3', L('objective.frequency.monthly'));
frequency.set('4', L('objective.frequency.totally'));


class Objective {

  constructor() {
    this.color = colors;
    this.unit = unit;
    this.priority = priority;
    this.frequency = frequency;
  }

  getPriorityColor(priorityValue) {
    let color;
    switch (priorityValue) {
      case 1:
        color = colors.priority1;
        break;
      case 2:
        color = colors.priority2;
        break;
      case 3:
      case 8:
      case 9:
        color = colors.priority3;
        break;
      default:
        color = colors.priority0;
    }
    return color;
  }

  getPriorityName(priorityValue) {
    return this.priority.get(priorityValue);
  }

  getUnitName(unitValue) {
    if (this.unit.has(unitValue)) {
      return this.unit.get(unitValue);
    } else {
      return unitValue;
    }
  }

  getFrequencyName(frequencyValue) {
    return this.frequency.get(frequencyValue);
  }
}

export default new Objective();



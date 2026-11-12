import { checkedCauseKeys, toggleCause, type Cause } from '@/library/causesOfDecline'

const housing = { mainCauseLabel: 'Development', answer: 'Housing' }
const ports = { mainCauseLabel: 'Development', answer: 'Ports' }
const rice = { mainCauseLabel: 'Agriculture', subCauseLabel: 'Crops', answer: 'Rice' }
const limes = { mainCauseLabel: 'Agriculture', subCauseLabel: 'Crops', answer: 'Limes' }
const pulp = { mainCauseLabel: 'Agriculture', subCauseLabel: 'Plantations', answer: 'Pulp' }

describe('toggleCause', () => {
  it('adds a main cause with its first answer, then more answers to it', () => {
    const one = toggleCause([], housing, true)
    expect(one).toEqual([
      {
        mainCauseLabel: 'Development',
        mainCauseAnswers: [{ mainCauseAnswer: 'Housing', levelOfDegradation: '' }]
      }
    ])

    const two = toggleCause(one, ports, true)
    expect(two[0]?.mainCauseAnswers?.map((a) => a.mainCauseAnswer)).toEqual(['Housing', 'Ports'])
    // The input isn't changed.
    expect(one[0]?.mainCauseAnswers).toHaveLength(1)
  })

  it('groups sub cause answers under their sub cause', () => {
    const causes = [rice, limes, pulp].reduce<Cause[]>((acc, o) => toggleCause(acc, o, true), [])

    expect(causes).toHaveLength(1)
    expect(causes[0]?.subCauses?.map((s) => [s.subCauseLabel, s.subCauseAnswers?.length])).toEqual([
      ['Crops', 2],
      ['Plantations', 1]
    ])
  })

  it('keeps levels already given and drops empty sub and main causes on uncheck', () => {
    let causes = toggleCause(toggleCause([], rice, true), limes, true)
    causes[0]!.subCauses![0]!.subCauseAnswers![1]!.levelOfDegradation = 'High'

    causes = toggleCause(causes, rice, false)
    expect(causes[0]?.subCauses?.[0]?.subCauseAnswers).toEqual([
      { subCauseAnswer: 'Limes', levelOfDegradation: 'High' }
    ])

    expect(toggleCause(causes, limes, false)).toEqual([])
    expect(toggleCause(toggleCause([], housing, true), housing, false)).toEqual([])
  })

  it('ignores a toggle that matches the current state', () => {
    const causes = toggleCause([], housing, true)
    expect(toggleCause(causes, housing, true)).toEqual(causes)
    expect(toggleCause(causes, ports, false)).toEqual(causes)
  })
})

describe('checkedCauseKeys', () => {
  it('lists main and sub cause answers, so saved answers show as checked', () => {
    const causes = [housing, rice].reduce<Cause[]>((acc, o) => toggleCause(acc, o, true), [])
    expect([...checkedCauseKeys(causes)]).toEqual([
      'Development / Housing',
      'Agriculture / Crops / Rice'
    ])
  })
})

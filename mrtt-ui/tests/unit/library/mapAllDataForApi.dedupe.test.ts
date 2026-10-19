import { mapAllDataForApi } from 'library/mapDataForApi'

// The real mapping has no shared question ids, so use one where two sections share '1.1'.
vi.mock('data/questionMapping', () => ({
  questionMapping: {
    first: { a: '1.1', b: '1.2' },
    second: { c: '1.1' }
  }
}))

describe('mapAllDataForApi deduplication', () => {
  it('keeps one answer per question_id, and the later section wins', () => {
    const result = mapAllDataForApi({
      first: { a: 'from first', b: 'only in first' },
      second: { c: 'from second' }
    })

    expect(result).toEqual([
      { question_id: '1.1', answer_value: 'from second' },
      { question_id: '1.2', answer_value: 'only in first' }
    ])
  })
})

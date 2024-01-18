import {
  AbstractAssembler,
  AggregateQuery,
  AggregateResponse,
  Assembler,
  DeepPartial,
  Query,
  transformAggregateQuery,
  transformAggregateResponse,
  transformQuery
} from '@ptc-org/nestjs-query-core'

describe('ClassTransformerAssembler', () => {
  class TestDTO {
    firstName!: string

    lastName!: string
  }

  class TestEntity {
    first!: string

    last!: string
  }

  @Assembler(TestDTO, TestEntity)
  class TestAssembler extends AbstractAssembler<TestDTO, TestEntity> {
    convertToCreateEntity(create: DeepPartial<TestDTO>): DeepPartial<TestEntity> {
      return {
        first: create.firstName,
        last: create.lastName
      }
    }

    convertToUpdateEntity(update: DeepPartial<TestDTO>): DeepPartial<TestEntity> {
      return {
        first: update.firstName,
        last: update.lastName
      }
    }

    convertToDTO(entity: TestEntity): TestDTO {
      return {
        firstName: entity.first,
        lastName: entity.last
      }
    }

    convertToEntity(dto: TestDTO): TestEntity {
      return {
        first: dto.firstName,
        last: dto.lastName
      }
    }

    convertQuery(query: Query<TestDTO>): Query<TestEntity> {
      return transformQuery(query, {
        firstName: 'first',
        lastName: 'last'
      })
    }

    convertAggregateQuery(aggregate: AggregateQuery<TestDTO>): AggregateQuery<TestEntity> {
      return transformAggregateQuery(aggregate, {
        firstName: 'first',
        lastName: 'last'
      })
    }

    convertAggregateResponse(aggregate: AggregateResponse<TestEntity>): AggregateResponse<TestDTO> {
      return transformAggregateResponse(aggregate, {
        first: 'firstName',
        last: 'lastName'
      })
    }
  }

  const testDTO: TestDTO = { firstName: 'foo', lastName: 'bar' }
  const testEntity: TestEntity = { first: 'foo', last: 'bar' }

  it('should throw an error if DTOClass or EntityClass cannot be determined', () => {
    class TestBadAssembler extends TestAssembler {}

    expect(() => new TestBadAssembler()).toThrow(
      'Unable to determine DTO or Entity types for TestBadAssembler. Did you annotate your assembler with @Assembler'
    )
    expect(() => new TestBadAssembler(TestDTO)).toThrow(
      'Unable to determine DTO or Entity types for TestBadAssembler. Did you annotate your assembler with @Assembler'
    )
    expect(() => new TestBadAssembler(undefined, TestEntity)).toThrow(
      'Unable to determine DTO or Entity types for TestBadAssembler. Did you annotate your assembler with @Assembler'
    )
  })

  describe('convertToDTOs', () => {
    it('should call the convertToDTO implementation', async () => {
      const assembler = new TestAssembler()
      expect(await assembler.convertToDTOs([testEntity])).toEqual([testDTO])
    })
  })

  describe('convertToEntities', () => {
    it('should call the convertToEntity implementation', async () => {
      const assembler = new TestAssembler()
      expect(await assembler.convertToEntities([testDTO])).toEqual([testEntity])
    })
  })
})

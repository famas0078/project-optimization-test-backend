import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { TepService } from './tep.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { User } from '../../db/entities/user.entity';
import {
  RequestInputDataForCostComparisonDto,
  RequestInputDataForDynamicsOfUnitAccumulatedCostsDto,
  RequestInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto,
  RequestInputDataForDynamicsOfUnitCostsDto,
  RequestInputDataForOwnershipCostStructureDto,
  RequestInputDataForParkProductivityDto,
  RequestInputDataForVolumesDto,
} from './dto/tep.request.dto';
import {
  ResponseClassInputDataForParkProductivityDto,
  ResponseInputDataForCostComparisonDto,
  ResponseInputDataForDynamicsOfUnitAccumulatedCostsDto,
  ResponseInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto,
  ResponseInputDataForOwnershipCostStructureDto,
  ResponseInputDataForParkProductivityDto,
  ResponseInputDataForUnitCostsDto,
  ResponseInputDataForVolumesDto,
} from './dto/tep.response.dto';

@ApiTags('TEP')
@ApiExtraModels(
  ResponseInputDataForParkProductivityDto,
  ResponseClassInputDataForParkProductivityDto,
)
@Controller('tep')
export class TepController {
  constructor(private tepService: TepService) {}

  @ApiOperation({
    summary:
      'Авторизация. График выполнение объемов добычи угля и вскрышных работ',
  })
  @ApiOkResponse({
    description: 'Массив объектов',
    type: [ResponseInputDataForVolumesDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('fulfilmentOfCoalMiningAndStrippingVolumes')
  async getVolumesProductionAndStripping(
    @GetUser() user: User,
    @Query() data: RequestInputDataForVolumesDto,
  ) {
    return await this.tepService.getVolumesProductionAndStripping(user, data);
  }

  @ApiOperation({
    summary: 'Авторизация. График производительности парка',
  })
  @ApiOkResponse({
    description: 'Массив объектов. Два ответа по классам/по маркам (машинам)',
    schema: {
      anyOf: refs(
        ResponseInputDataForParkProductivityDto,
        ResponseClassInputDataForParkProductivityDto,
      ),
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('monthlyParkProductivity')
  async getMonthlyParkProductivity(
    @GetUser() user: User,
    @Query() data: RequestInputDataForParkProductivityDto,
  ) {
    return await this.tepService.getMonthlyParkProductivity(user, data);
  }

  @ApiOperation({
    summary: 'Авторизация. Динамика удельных затрат',
  })
  @ApiOkResponse({
    description: 'Массив объектов',
    type: [ResponseInputDataForUnitCostsDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('dynamicsOfUnitCosts')
  async getDynamicsOfUnitCosts(
    @GetUser() user: User,
    @Query() data: RequestInputDataForDynamicsOfUnitCostsDto,
  ) {
    return await this.tepService.getDynamicsOfUnitCosts(user, data);
  }

  @ApiOperation({
    summary: 'Авторизация. Сравнение целевых и фактических затрат',
  })
  @ApiOkResponse({
    description: 'Массив объектов',
    type: [ResponseInputDataForCostComparisonDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('comparisonOfTargetAndActualUnitCosts')
  async getCostComparison(
    @GetUser() user: User,
    @Query() data: RequestInputDataForCostComparisonDto,
  ) {
    return await this.tepService.getCostComparison(user, data);
  }

  @ApiOperation({
    summary: 'Авторизация. Структура затрат на владение',
  })
  @ApiOkResponse({
    description: 'Массив объектов',
    type: [ResponseInputDataForOwnershipCostStructureDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('structureOfEquipmentOwnershipCosts')
  async getOwnershipCostStructure(
    @GetUser() user: User,
    @Query() data: RequestInputDataForOwnershipCostStructureDto,
  ) {
    return await this.tepService.getOwnershipCostStructure(user, data);
  }

  @ApiOperation({
    summary:
      'Авторизация. Динамика удельных накопленных затрат и производительности',
  })
  @ApiOkResponse({
    description: 'Массив объектов. Если данных нет то data будет пустым массивом',
    type: [ResponseInputDataForDynamicsOfUnitAccumulatedCostsDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('dynamicsOfUnitAccumulatedCosts')
  async getDynamicsOfUnitAccumulatedCosts(
    @GetUser() user: User,
    @Query() data: RequestInputDataForDynamicsOfUnitAccumulatedCostsDto,
  ) {
    return await this.tepService.getDynamicsOfUnitAccumulatedCosts(user, data);
  }

  @ApiOperation({
    summary:
      'Авторизация. Динамика удельных накопленных затрат в сравнении с отраслевой практике',
  })
  @ApiOkResponse({
    description:
      'Массив объектов. Если данных нет то data будет пустым массивом',
    type: [
      ResponseInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto,
    ],
  })
  @UseGuards(JwtAuthGuard)
  @Get('dynamicsOfUnitAccumulatedCostsWithIndustryReplacement')
  async getDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement(
    @GetUser() user: User,
    @Query()
    data: RequestInputDataForDynamicsOfUnitAccumulatedCostsWithIndustryReplacementDto,
  ) {
    return await this.tepService.getDynamicsOfUnitAccumulatedCostsInComparisonWithIndustryReplacement(
      user,
      data,
    );
  }
}

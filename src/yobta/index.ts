import { createContext } from '../_internal/createContext/index.js'
import { handleUnknownError } from '../_internal/parseUnknownError/index.js'
import type {
  Functions,
  PipedFunctions,
  PipeFactoryResult,
  SyncRulesPipeYobta,
} from '../_internal/pipe/index.js'
import { pipe } from '../_internal/pipe/index.js'
import type { YobtaContext } from '../_types/YobtaContext.js'
import type { YobtaOptionalIfUnkown } from '../_types/YobtaOptionalIfUnkown.js'
import type {
  SyncRules,
  SyncRulesChain1,
  SyncRulesChain2,
  SyncRulesChain3,
  SyncRulesChain4,
  SyncRulesChain5,
  SyncRulesChain6,
  SyncRulesChain7,
} from '../ruleYobta/index.js'
import type { YobtaError } from '../YobtaError/index.js'

//#region Types
export type SyncValidatorYobta<I, O> = (input: I) => YobtaOptionalIfUnkown<I, O>
export interface YobtaFactory {
  <R1, R2, R3, R4, R5, R6, R7>(
    ...rules: SyncRulesChain7<R1, R2, R3, R4, R5, R6, R7>
  ): SyncValidatorYobta<any, R7>
  <R1, R2, R3, R4, R5, R6>(
    ...rules: SyncRulesChain6<R1, R2, R3, R4, R5, R6>
  ): SyncValidatorYobta<any, R6>
  <R1, R2, R3, R4, R5>(
    ...rules: SyncRulesChain5<R1, R2, R3, R4, R5>
  ): SyncValidatorYobta<any, R5>
  <R1, R2, R3, R4>(
    ...rules: SyncRulesChain4<R1, R2, R3, R4>
  ): SyncValidatorYobta<any, R4>
  <R1, R2, R3>(
    ...rules: SyncRulesChain3<R1, R2, R3>
  ): SyncValidatorYobta<any, R3>
  <R1, R2>(...rules: SyncRulesChain2<R1, R2>): SyncValidatorYobta<any, R2>
  <R1>(...rules: SyncRulesChain1<R1>): SyncValidatorYobta<any, R1>
  <R extends SyncRules>(
    ...rules: SyncRulesPipeYobta<R>
  ): (input: any) => PipeFactoryResult<R>
}
//#endregion

export const field = '@'

export const yobta: YobtaFactory =
  <R extends SyncRules>(...rules: R) =>
  (data: any) => {
    const context: YobtaContext = {
      ...createContext(data),
      pushError(error: YobtaError) {
        throw error
      },
    }

    const validators = rules.map(next =>
      next(context),
    ) as PipedFunctions<Functions>

    try {
      return pipe(...validators)(data)
    } catch (error) {
      throw handleUnknownError({ error, field, path: [] })
    }
  }

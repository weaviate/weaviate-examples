import { Dispatch, SetStateAction } from 'react'

export type StateValue<S> = [S, Dispatch<SetStateAction<S>>]

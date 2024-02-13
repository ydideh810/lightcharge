import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type Props = {
  numberOfRewardsAvailable: number
}

export const ProjectRewardAvailability = ({ numberOfRewardsAvailable }: Props) => {

    const { t } = useTranslation()

    if(numberOfRewardsAvailable === 0) {
        return <><Box as={'span'} color={'neutral.600'} fontWeight={700}>{t('Sold Out')}</Box> <Box as={'span'} style={{fontSize: "10px", position: "relative", top: "-2px"}}>&#8226;</Box> </>;
    } 
    else if ( numberOfRewardsAvailable > 3 ) {
        return <><Box as={'span'}>{numberOfRewardsAvailable + ` ${t('remaining')}`}</Box> <Box as={'span'} style={{fontSize: "10px", position: "relative", top: "-2px"}}>&#8226;</Box> </>;
    } 
    else if ( numberOfRewardsAvailable > 0 && numberOfRewardsAvailable <= 3 ) {
        return <><Box as={'span'} color={'secondary.red'}>{numberOfRewardsAvailable + ` ${t('remaining')}`}</Box> <Box as={'span'} style={{fontSize: "10px", position: "relative", top: "-2px"}}>&#8226;</Box> </>;
    }
    return <></>;
}

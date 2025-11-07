import React from 'react'
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import Button from "@/components/shared/ui/Button";

import SpecForm from "@/components/pages/admin/CreateSpec/ui/SpecForm";

const CreateSpec = () => {
    return (
        <Page className=''>
            <Substrate className='' color="bg-color">
                <h3>Specialist create / edit</h3>
                <h4>Specialist info: </h4>
                <SpecForm />
            </Substrate>
        </Page>
    )
}

export default CreateSpec;


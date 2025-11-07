import React from 'react';
import { useSelector } from 'react-redux';
import { loadMessages } from '@/components/shared/i18n/translationLoader';
import Page from "@/components/shared/ui/Page/Page";
import Substrate from "@/components/shared/ui/Substrate/Substrate";
import s from './.module.scss';

const ExpertPolicy = () => {
    const currentLocale = useSelector(({ locale }) => locale.currentLocale);
    const t = loadMessages(currentLocale);

    return (
        <Page>
            <Substrate color="bg-color" className={s.wrapper}>
                <h2 className={s.header}>{t.expert_policy_header}</h2>
                <div className={s.content}>
                    <p>{t.expert_policy_intro_01}</p>
                    <p>{t.expert_policy_intro_02}</p>

                    <h3>{t.expert_1_registration_title}</h3>
                    <h4>{t.expert_1_1_registration_subtitle}</h4>
                    <p>{t.expert_1_1_registration_text_01}</p>
                    <p>{t.expert_1_1_registration_text_02}</p>

                    <h4>{t.expert_1_2_services_description_subtitle}</h4>
                    <p>{t.expert_1_2_services_description_text}</p>
                    <ul>
                        <li>{t.expert_services_point_01}</li>
                        <li>{t.expert_services_point_02}</li>
                        <li>{t.expert_services_point_03}</li>
                        <li>{t.expert_services_point_04}</li>
                        <li>{t.expert_services_point_05}</li>
                    </ul>

                    <h3>{t.financial_terms_2_for_experts}</h3>
                    <p>{t.financial_terms_2_subtitle}</p>
                    <h4>{t.financial_terms_2_1_title}</h4>
                    <p>{t.financial_terms_2_1_text}</p>

                    <h4>{t.financial_terms_2_2_title}</h4>
                    <p>{t.financial_terms_2_2_text}</p>

                    <h4>{t.financial_terms_2_3_title}</h4>
                    <p>{t.financial_terms_2_3_text}</p>

                    <h4>{t.financial_terms_2_4_title}</h4>
                    <p>{t.financial_terms_2_4_text}</p>

                    <h3>{t.expert_services_3_guidelines}</h3>
                    <h4>{t.expert_services_3_1_request}</h4>
                    <p>{t.expert_service_request_text}</p>

                    <p>{t.expert_service_3_1_request_p_1}</p>
                    <p>{t.expert_service_3_1_request_p_2}</p>
                    <p>{t.expert_service_3_1_request_p_3}</p>
                    <p>{t.expert_service_3_1_request_p_4}</p>

                    <h4>{t.expert_3_2_session_policy}</h4>
                    <h4>{t.expert_3_2_1_accepting_session_requests}</h4>
                    <p>{t.expert_3_2_1_accepting_session_text}</p>

                    <h4>{t.expert_3_2_2_cancelling_session}</h4>
                    <p>{t.cancelling_session_3_2_2_text_01}</p>
                    <p>{t.cancelling_session_3_2_2_text_02}</p>

                    <h4>{t.session_packages_3_2_3}</h4>
                    <p>{t.session_packages_3_2_3_text}</p>

                    <h4>{t.additional_guidelines_3_2_4}</h4>
                    <p>{t.additional_guidelines_3_2_4_text}</p>


                    <p>{t.additional_guidelines_3_2_4_point_01}</p>
                    <p>{t.additional_guidelines_3_2_4_point_02}</p>
                    <p>{t.additional_guidelines_3_2_4_point_03}</p>
                    <p>{t.additional_guidelines_3_2_4_point_04}</p>
                    <p>{t.additional_guidelines_3_2_4_point_05}</p>


                    <h3>{t.expert_code_4}</h3>
                    <h4>{t.expert_code_4_1_culturally_sensitive}</h4>
                    <p>{t.expert_code_4_1_text}</p>

                    <h4>{t.expert_code_4_2_be_professional}</h4>
                    <p>{t.expert_code_4_2_be_professional_text}</p>

                    <p>{t.expert_code_4_2_be_professional_point_01}</p>
                    <p>{t.expert_code_4_2_be_professional_point_02}</p>
                    <p>{t.expert_code_4_2_be_professional_point_03}</p>

                    <h4>{t.expert_code_4_3_arrive_on_time}</h4>
                    <p>{t.expert_code_4_3_arrive_on_time_text_01}</p>
                    <p>{t.expert_code_4_3_arrive_on_time_text_02}</p>

                    <h4>{t.expert_code_4_4_mindhealer_ambassador}</h4>
                    <p>{t.expert_code_4_4_mindhealer_ambassador_text}</p>

                    <h3>{t.expert_content_5}</h3>
                    <p>{t.expert_content_5_text}</p>

                    <h4>{t.expert_content_5_1_ownership}</h4>
                    <p>{t.expert_content_5_1_ownership_text}</p>

                    <h4>{t.expert_content_5_2_customer_license_to_expert}</h4>
                    <p>{t.expert_content_5_2_customer_license_to_expert_text}</p>

                    <h4>{t.expert_content_5_3_license_to_expert_content}</h4>
                    <p>{t.expert_content_5_3_license_to_expert_content_text}</p>

                    <h3>{t.prohibitions_6}</h3>
                    <p>{t.prohibitions_6_text}</p>

                    <p>{t.prohibitions_6_point_01}</p>
                    <p>{t.prohibitions_6_point_02}</p>
                    <p>{t.prohibitions_6_point_03}</p>
                    <p>{t.prohibitions_6_point_04}</p>
                    <p>{t.prohibitions_6_point_05}</p>
                    <p>{t.prohibitions_6_point_06}</p>
                    <p>{t.prohibitions_6_point_07}</p>
                    <p>{t.prohibitions_6_point_08}</p>
                    <p>{t.prohibitions_6_final_text}</p>

                    <h3>{t.violation_7_expert_policy}</h3>
                    <p>{t.violation_7_expert_policy_text}</p>
                    <p>{t.violation_7_expert_policy_point_01}</p>
                    <p>{t.violation_7_expert_policy_point_02}</p>
                    <p>{t.violation_7_expert_policy_point_03}</p>
                    <p>{t.violation_7_expert_policy_point_04}</p>

                    <p>{t.violation_7_response_text}</p>
                    <p>{t.violation_7_response_point_01}</p>
                    <p>{t.violation_7_response_point_02}</p>
                    <p>{t.violation_7_response_point_03}</p>
                    <p>{t.violation_7_response_point_04}</p>

                    <h3>{t.customer_service_8}</h3>
                    <h3>{t.customer_service_8_text}</h3>

                </div>
            </Substrate>
        </Page>
    );
};

export default ExpertPolicy;

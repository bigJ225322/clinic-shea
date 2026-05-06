import { useState, useMemo, useEffect, useRef } from "react";

/* ============================================================================
 * EMBEDDED DATA — injected at build time.
 *   TEMPLATES: { [procedureId]: noteBody }  (61 entries, keyed by source line #)
 *   CHUNKS:    [{ id, section, title, line, body }]  (213 entries)
 * ==========================================================================*/
const TEMPLATES = {
 "loe": " - y/o female patient presents to Vivaldi clinic for a problem-focused limited oral exam. Chief complaint: “.”\n - medical history: RMH; no changes\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n EOE: WNL — no lymphadenopathy, no swelling, no asymmetry.\n\n IOE:\n - \n - Lips, gingiva, buccal mucosa, tongue, floor of mouth, oropharynx are all WNL without signs of pathology.\n\n Radiographs:\n - \n\n Assessment:\n - \n\n Plan:\n - \n\n - NV:",
 "273": "  y/o female presents to UIC COD for screening appointment. Pt’s CC: “ .” Reviewed medical history. Performed oral inspection. Explained college\n policies, including attendance, transportation, & financial policy. Patient is provisionally accepted to UG clinic.\n\n Planned COE, FMX, pan.\n\n NV: COE",
 "374": " S\n - y/o female patient presents to Urgent Care in Vivaldi clinic with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n HPI:\n -\n - location:\n - inception:\n - triggers:\n - spontaneous pain:\n - lingering pain:\n - pain wakes pt up at night:\n - quality:\n - frequency:\n - duration:\n - intensity:\n - other symptoms:\n - treatment/evaluation thus far:\n - relief:\n - last pain medication taken & effectiveness:\n - anything else?:\n\n O\n\n EOE:\n Pt appears generally healthy in the dental chair. No visible asymmetries. EOE WNL with normal skin texture and color, normal facial movements,\n no visible/palpable masses, no lymphadenopathy, normal facial muscle movement & palpation, and normal TMJ movement and palpation\n bilaterally.\n\n IOE:\n - (heavily restored / carious dentition), (complete dentition / partially edentulous), (heavy calculus & active periodontal disease)\n -\n - Lips, gingiva, buccal mucosa, tongue, floor of mouth, oropharynx are all WNL without signs of pathology, asymmetry, or swelling\n\n Radiographs:\n - BW & PA taken\n - Radiographs reveal\n - Radiograph otherwise unremarkable & free of pathology\n\n Endo testing:\n - #: percussion +++, palpation +++, probing X mm, mobility 1, cold test 0.5/20 s\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n\n Consultations:\n - Dr. [Name] -- restorative consult:\n - Dr. [Name] -- perio consult:\n - Dr. [Name] -- OS consult:\n\n A\n Endo diagnoses:\n - Pulpal diagnosis #:\n - Periapical diagnosis #:\n\n P\n Thoroughly discussed treatment options, costs, & timelines with pt. Specifically discussed tx options: (1) no treatment, (2) RTC + potential\n post/CBU/crown lengthening + crown, (3) extraction + replacement options (implant/bridge/RPD). Discussed advantages & disadvantages of\n treatments. Pt’s questions were answered & pt understood treatment options. Pt opts for .\n\n NV:",
 "448": " S\n - y/o female patient presents to Urgent Care in Vivaldi clinic with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n\n HPI:\n\n O\n - IOE reveals\n - Panoramic radiograph taken & reveals . Radiograph otherwise unremarkable & free of pathology.\n\n A\n - [mild/moderate/severe] pericoronitis\n\n P\n Pt referred to PGOS for extraction #1, #16, #17, #32. Consult appointment scheduled for .\n\n NV:",
 "573": " S\n\n - y/o female patient presents to Vivaldi clinic for Perio COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: last time at dentist: ; brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n O\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Radiographic findings:\n - generalized horizontal bone loss\n - generalized moderate interproximal calculus\n - adverse crown to root ratio:\n - evidence of furcation:\n - widened PDL:\n\n A\n\n Periodontal diagnosis:\n - AAP:\n - ADA:\n\n Prognosis:\n - fair:\n - questionable:\n - hopeless:\n\n P\n\n - Took diagnostic impressions, facebow, & bite registration.\n - treatment plan: SRP 4 quads, then 4-6 week re-eval\n\n - NV: restorative COE",
 "703": " S\n\n - y/o female patient presents to Vivaldi clinic for Restorative COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: last time at dentist: ; brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n O\n\n Completed extraoral exam & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n Updated odontogram with radiographic & clinical hard tissue findings:\n -\n\n - occlusal assessment:\n - endo testing:\n\n A\n - TMJ conditions: WNL\n - soft tissue conditions: WNL\n - hard tissue conditions: WNL\n - caries risk:\n - pulpal diagnosis: WNL\n - occlusal conditions: WNL\n - esthetic considerations: WNL\n\n P\n - Took diagnostic impressions, facebow, & bite registration.\n - Took intraoral photos.\n\n - NV: treatment plan",
 "807": "   y/o female patient presents to Vivaldi clinic for treatment plan presentation.\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n All treatment options, costs, & timelines were thoroughly reviewed with the patient. Discussed advantages & disadvantages of treatments. Pt’s\n questions were answered & pt understood treatment options. Pt opts for optimal treatment plan. Verbal and written consent obtained.\n\n Specific treatments discussed:\n — Pt understands crown on #18 needs to be removed & caries needs to be evaluated/excavated before tooth can be deemed restorable. Pt\n understands that if tooth is nonrestorable, extraction & implant or adding tooth to RPD are tx options.\n — Pt understands caries on #8 approximates pulp, and that pulp may be exposed during excavation. Pt understands tooth may need RCT + crown.\n —\n\n NV:",
 "871": "  y/o female patient presents to Chicago clinic for #4 STI consultation.\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Patient was evaluated for UG STI placement #4. Patient is provisionally accepted for UG STI placement pending CBCT results.\n\n NV:",
 "1091": " - y/o female patient presents to Vivaldi clinic for POE\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n POE:\n\n Completed extraoral & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n - caries risk:\n\n Took 4 bitewings; updated odontogram with radiographic & clinical hard tissue findings:\n -\n - endo testing:\n\n Prophy:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed supragingival & subgingival plaque & calculus using Cavitron (with an assistant using HVE) & hand instruments. Flossed. Polished with\n prophy paste. Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation.\n\n Treatment planned for the following treatments:\n -\n Thoroughly reviewed all treatment options, costs, & timelines with pt. Discussed advantages & disadvantages of treatments. Answered pt’s\n questions. Pt understood treatment options. Obtained verbal and written consent for tx plan.\n\n - NV:",
 "1196": " - y/o female patient presents to Vivaldi clinic for prophy\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Prophy:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed plaque & calculus using Cavitron (with assistant using HVE) & hand instruments. Flossed. Polished with prophy paste.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration. Emphasized that patient needs to .\n\n - NV:",
 "1272": " - y/o female patient presents to Vivaldi clinic for SRP of UR.\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n SRP UR:\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltrations of UR quadrant & greater palatine block on R.\n\n Completed SRP using Cavitron (with an assistant using HVE) & hand instruments to remove supragingival and subgingival plaque & calculus.\n Flossed.\n\n Gave pt post-op instructions re: numbness, sore gums, tooth sensitivity, bleeding, ibuprofen/acetaminophen regimen.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration. Emphasized that patient needs to .\n\n - NV:",
 "1346": " - y/o female patient presents to Vivaldi clinic for perio re-evaluation after SRP 4 quads completed 1/1/2000\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Perio re-eval:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - O’Leary plaque index:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n\n Patient’s periodontal health has improved — . Upon evaluation, patient will be placed on perio maintenance interval of 4 months.\n\n - NV:",
 "1425": " - y/o female patient presents to Vivaldi clinic for perio maintenance\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Perio maintenance:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed plaque & calculus using Cavitron (with assistant using HVE) & hand instruments. Flossed. Polished with prophy paste.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration. Emphasized that patient needs to .\n\n - NV:",
 "1549": " - y/o female patient presents to Vivaldi clinic for #19-MOD amalgam\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as left IAN & long\n buccal block on right / buccal infiltration #19.\n\n #19-MOD amalgam:\n Placed Isodry (size M). Completely removed failing existing MOD composite restoration and excavated decay using high & slow speed burs.\n Prepared cavity preparation to ideal form. Applied Gluma in scrubbing motion for 10s then rinsed thoroughly. Placed Tofflemire band. Delivered,\n overfilled, & condensed amalgam. Removed excess & carved amalgam to ideal anatomic form. Interproximal contact evaluated with floss &\n adjusted to ideal. Occlusion evaluated with articulating paper & adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness,\n sensitivity, sore injection site, uneven bite.\n\n - NV:",
 "1641": " - y/o female patient presents to Vivaldi clinic for #19-O composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19-O:\n Placed Isodry (size M). Removed existing failing O amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep,\n light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried,\n rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill\n composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy brush.\n Evaluated occlusion with articulating paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore\n injection site, uneven bite.\n\n - NV:",
 "1745": " - y/o female patient presents to Vivaldi clinic for #19-MOD composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19-MOD:\n Placed Isodry (size M). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. Scrubbed with Consepsis 10s to disinfect, rinsed 5s,\n gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried\n leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s,\n air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with\n finishing diamond burs, polished with Shofu & Jiffy brush. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with\n articulating paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:",
 "1850": " - y/o female patient presents to Vivaldi clinic for #8-ML composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #8.\n\n #8-ML:\n Placed Isodry (size M). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm\n Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied\n shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished\n with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating\n paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:",
 "1950": " - y/o female patient presents to Vivaldi clinic for #9-MIFL composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #9.\n\n #9-MIFL:\n Placed Isodry (size M). Removed existing failing MIFL composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm\n Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied\n shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished\n with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating\n paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:",
 "2046": " - y/o female patient presents to Vivaldi clinic for #5-B composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #5.\n\n #5-B:\n Placed Isodry (size M). [ Pt has non-carious cervical lesion that does not require caries excavation. Surface roughened with diamond burs. ]\n Removed existing failing B composite restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation to ideal form.\n Placed gingival retentive groove & M,D incisal retentive points. Placed gingival retraction cord #0 soaked with Hemodent. Scrubbed with Consepsis\n 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for\n 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure.\n Removed cord. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy brush. Patient is satisfied. Gave post-op instructions\n re: numbness, sensitivity, sore injection site.\n\n - NV:",
 "2156": " - y/o female patient presents to Vivaldi clinic for #8-9 composite veneers\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as buccal infiltrations\n in anterior maxilla. Placed gingival retraction cords #0 soaked in Hemodent.\n\n #8-9 composite veneers:\n Lightly prepared teeth to receive composite veneers, including wide facial bevel. Placed clear mylar strip & wedge. Etched with 35% phosphoric\n acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Repeated with both teeth, #8 & #9. Removed cords. Evaluated occlusion with articulating paper, adjusted to ideal.\n Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, no biting into foods with incisors.\n\n - NV:",
 "2243": " - y/o female patient presents to Vivaldi clinic for #6 class V RMGI\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #6.\n\n #5-B RMGI:\n Placed Isodry (size M). [ Pt has non-carious cervical lesion that does not require caries excavation. Surface roughened with diamond burs. ]\n Removed existing failing B composite restoration. Excavated decay using high & slow speed burs. Placed gingival retentive groove & M,D incisal\n retentive points. Prepared cavity preparation to ideal form. Placed gingival retraction cord #0 soaked with Hemodent. Scrubbed with Consepsis\n 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Applied RMGI cavity conditioner 15s,\n air dried 10s, light cured 10s. Applied shade A2 Ketac Nano RMGI in increments, each cured 20s. Removed cord. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site.\n\n - NV:",
 "2308": " - y/o female patient presents to Vivaldi clinic for sealants\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Sealants — #2, #3, #14, #15, #18, #19, #30, #31\n Tooth cleaned with pumice & prophy angle. Isodry placed (size M). Etched with 35% phosphoric acid for 30s, rinsed 15s, gently dried. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit of mandibular molars /\n lingual groove of maxillary molars. Light cured 20s. Repeated for all molars (#2, #3, #14, #15, #18, #19, #30, #31). Occlusion evaluated with\n articulating paper -- occlusion is satisfactory, pt is not occluding on sealant.\n\n - NV:",
 "2353": " - y/o female patient presents to Vivaldi clinic to take records for occlusal guard.\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Took alginate impressions & facebow for occlusal guard fabrication.\n\n NV: occlusal guard delivery",
 "2428": " - y/o female patient presents to Vivaldi clinic for occlusal guard delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Occlusal guard delivery:\n\n Tried in occlusal guard, evaluated with articulating paper, & adjusted with lab burs to achieve: (1) bilateral centric contact in occlusion, (2)\n posterior disclusion & minimal incisal guidance in protrusion, (3) canine guidance in lateral movements.\n\n Instructed pt how to insert & remove occlusal guard; pt was able to do so unaided. Instructed pt how to use & maintain occlusal guard. Printed\n post-op instructions given to pt.\n\n NV:",
 "2742": " - y/o female patient presents to Vivaldi clinic for #19 core buildup (for PFM crown)\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 core buildup:\n Placed Isodry (size M). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. Scrubbed with Consepsis 10s to disinfect, rinsed 5s,\n gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried\n leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s,\n air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Restoration finished using\n finishing diamond burs & Shofu. Interproximal contact evaluated with floss & adjusted to ideal. Occlusion evaluated with articulating paper &\n adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n - NV: #19 PFM crown prep",
 "2821": " - y/o female patient presents to Vivaldi clinic for #19 PFM crown prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 PFM crown prep + new provisional:\n Completed crown prep to ideal form. Placed #0 gingival retraction cord soaked in Hemodent. Fabricated new provisional using Integrity shade A2.\n Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp. Removed cord. Removed excess cement & flossed.\n Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts evaluated with floss & are\n satisfactory.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite, provisional precautions.\n\n NV:",
 "3002": " - y/o female patient presents to Vivaldi clinic for new provisional crown\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n#19 new provisional crown:\nPlaced #0 gingival retraction cord soaked in Hemodent. Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory\n marginal adaptation. Cemented with UltraTemp. Removed cords. Removed excess cement & flossed. Evaluated interproximal contacts with floss,\n adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n - NV:",
 "3076": " - y/o female patient presents to Vivaldi clinic for #19 PFM crown final impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19 PFM crown final impression:\n Removed provisional. Removed temporary cement. Refined preparation to ideal. Placed gingival retraction cords #00 & #0 soaked with Hemodent.\n Achieved good isolation & took final impression using heavy body PVS & light body PVS. Removed cords. Final impression & lab script sent to lab.\n\n Re-cemented provisional with UltraTemp. Removed excess cement & flossed. Evaluated interproximal contacts with floss, adjusted to ideal.\n Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n - NV: #19 PFM delivery",
 "3204": " - y/o female patient presents to Vivaldi clinic for #19 PFM cementation\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #19 PFM cementation:\n\n Removed provisional crown. Removed temporary cement with a scaler. Cleaned tooth with pumice & prophy angle.\n\n Tried on & evaluated crown:\n - Marginal adaptation satisfactory; verified visually, tactilely, & radiographically (BW taken).\n - Interproximal contacts are satisfactory as evaluated with floss.\n - Occlusal contacts & excursive contacts are satisfactory as evaluated with articulating paper.\n - Patient approved shade & shape.\n\n Isolated with dry-angles & cotton rolls. Cemented crown with RelyX following proper manufacturer’s instructions. Removed excess cement.\n Verified marginal adaptation & interproximal contacts. Evaluated & adjusted occlusal contacts & excursive contacts to ideal. Polished ceramic. Pt\n is satisfied with bite & esthetics. Gave verbal post-op instructions re: 24 hr set, uneven bite.\n\n NV:",
 "3268": " Isolated with Isodry to protect airway. Original #19-PFM crown is shade A2. Sectioned crown buccally & occlusally using crown-removing burs. Used\n crown removers to remove crown. Took BW radiograph.",
 "3319": " - y/o female patient presents to Vivaldi clinic for #19 PFM crown endo access fill (core buildup)\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #19 PFM crown endo access fill (core buildup):\n\n IOE reveals intact #14 crown with sound closed margins, and access filled with Cavit. BW taken recently show crown with sound, closed margins.\n\n Placed Isodry (size M). Completely removed Cavit with high speed bur. Removed sponge pellet. Applied Consepsis in scrubbing motion for 10s for\n disinfection, then rinsed. Applied 0.5 mm layer of Vitrebond to cover gutta percha, light cured 10s on high. Etched with 35% phosphoric acid for\n 10s then rinsed & gently dried, leaving dentin moist. Applied Scotchbond Universal, lightly air dried, & cured 10s on high. Shade A2 Renamel\n nanofilled composite applied in increments, each cured 20s on high. Restoration finished using finishing diamond burs & polished using Shofu.\n Occlusion evaluated with articulating paper & adjusted to ideal. Patient is satisfied.\n\n - NV:",
 "3704": " S\n - y/o female patient presents to Vivaldi clinic for COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n [ History ]\n\n O\n\n Completed extraoral exam & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n A\n - Pt is completely edentulous and needs new complete dentures fabricated. Residual ridges are suitable for F/F fabrication; no need for\n preprosthetic intervention.\n - Briefly discussed option of IOD.\n\n P\n - Took diagnostic impressions.\n - Treatment options, costs, & timelines were thoroughly reviewed with the patient. Specifically explained that dentures may take 10\n appointments, each 3 hours. Discussed advantages & disadvantages of treatments. Managed pt’s expectations with full dentures. Pt’s questions\n were answered & pt understood treatment plan. Verbal and written consent obtained.\n\n - NV: border molding & final impression with custom trays",
 "3831": " - y/o female patient presents to Vivaldi clinic for F/F border molding & final impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F border molding:\n - Tried in custom trays and adjusted to ideal extension.\n - Border molded maxillary & mandibular custom trays with greenstick compound.\n - Took final impression with light-body PVS.\n\n - NV: wax rim try-in",
 "3954": " - y/o female patient presents to Vivaldi clinic for F/F wax rim try-in\n - medical history: RMH, no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F wax rims:\n\n - Tried in maxillary wax rim. Adjusted record base for ideal fit.\n - Used Fox plane to adjust maxillary occlusal plane parallel to ala-tragus line & interpupillary line.\n - Adjusted maxillary wax rim to produce ideal phonetics, lip support, & incisal display.\n - Marked midline on maxillary wax rim; pt approves. Marked canine lines & high smile line.\n\n - VDR marked.\n - Tried in mandibular wax rim. Adjusted record base for ideal fit.\n - Adjusted occlusal plane to match maxillary occlusal plane & achieve proper VDO.\n\n - Evaluated multiple denture tooth shades with pt. Selected tooth shade B1. Selected gingival shade OR (original). Pt is satisfied with these\n choices.\n - intercanine distance: 50.0 mm\n - high smile line: 10.0 mm\n - Based on intercanine distance & high smile line, selected anterior maxillary tooth mold 32E. Corresponding mandibular tooth mold: C.\n\n - Took facebow & jaw relation record.\n\n - NV: anterior wax try-in",
 "4055": " - y/o female patient presents to Vivaldi clinic for F/F anterior try-in\n - medical history:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F anterior try-in:\n - Verified VDR, VDO, & mounting.\n - Evaluated midline, incisal edge position, & occlusal plane and adjusted to ideal.\n - Evaluated lip support and adjusted to ideal.\n - Evaluated fricative & sibilant sounds and adjusted dentures to produce ideal phonetics.\n - Confirmed posterior palatal seal.\n - Evaluated tooth shape, shade, & positioning. Pt expressed satisfaction with esthetics.\n\n - NV: posterior/final wax try-in",
 "4169": " - y/o female patient presents to Vivaldi clinic for F/F posterior/final wax try-in\n - medical history: RMH, no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F posterior (final) try-in:\n - Inserted F/F trial dentures and confirmed midline, incisal edge position, lip support, phonetics, esthetics, & occlusal plane. Adjusted to ideal.\n - Adjusted teeth to achieve ideal occlusal, lateral, & protrusive contacts.\n - Pt evaluated trial dentures using a mirror & expressed satisfaction with all aspects of denture. Confirmed size, shape, color, & positioning of\n anterior teeth.\n - Explained denture consent form & obtained pt’s signed consent.\n - Submitted wax trial dentures to lab for processing.\n\n - NV: F/F delivery",
 "4257": " - y/o female patient presents to Vivaldi clinic for F/F delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F delivery:\n - F/F tried in. Pt approves of esthetics & reports that dentures feel comfortable, no areas of immediate concern.\n - Evaluated F/F intaglio with PIP paste. No adjustment needed at this time. / Adjusted intaglio with burs accordingly.\n - Evaluated occlusion with horseshoe articulating paper. F/F show balanced occlusion, bilateral balanced articulation, & contact in protrusion; no\n adjustments needed at this time. / Adjusted teeth to achieve balanced occlusion, bilateral balanced articulation, & contact in protrusion.\n - F/F polished with rag wheel & pumice.\n - Post-delivery instructions printed for pt & reviewed verbally. Gave pt denture toothbrush, box, polident, polygrip. Pt instructed not to remove\n dentures until 24 hr followup tomorrow. Pt understands.\n\n NV: 24 hr post-delivery followup",
 "4374": " - y/o female patient presents to Vivaldi clinic for F/F adjustment\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F adjustment:\n — CC: “.” Pt reports that .\n — IOE reveals .\n — Sore spot on buccal of anterior mandibular residual ridge marked with Thompson stick, transferred, & intaglio adjusted accordingly.\n — Applied PIP; evaluated & adjusted intaglio to relieve areas of excessive pressure.\n — Evaluated occlusion with horseshoe articulating paper; adjusted denture teeth accordingly. Repeated to achieve bilaterally balanced occlusion.\n — F/F polished with rag wheel & pumice.\n\n Pt reports improvement & is satisfied. Advised pt that sore spots will still feel tender even with denture adjustment and will take a few days to\n heal.\n\n NV:",
 "4454": " - y/o female patient presents to Vivaldi clinic for F/ lab reline\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/ adjustment\n — CC: “.” Pt reports that .\n — IOE reveals .\n — Sore spot on buccal of anterior mandibular residual ridge marked with Thompson stick, transferred, & intaglio adjusted accordingly.\n — Applied PIP; evaluated & adjusted intaglio to relieve areas of excessive pressure.\n — Evaluated occlusion with horseshoe articulating paper; adjusted denture teeth accordingly. Repeated to achieve bilaterally balanced occlusion.\n\n Verified VDO, overjet, overbite, occlusion, articulation. F/ is ready for reline.\n\n F/ lab reline\n — F/ intaglio relieved with lab bur by 0.5 mm.\n — Drilled relief hold in F/ palate.\n — Took impression with light-body PVS against natural dentition in CR. Verified correct placement — midline & VDO are correct.\n — Denture impression sent to lab.\n\n Informed pt that F/ will be sent to lab. Instructed pt to use interim immediate F/ in the meantime. Adjusted interim immediate F/ so that pt is\n comfortable using it. Advised soft diet.\n\n NV: F/ delivery post-lab-reline",
 "4574": " - y/o female patient presents to Chicago clinic for #13 STI implant-level impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI implant-level impression:\n\n Tissue surrounding #13 healing abutment is healthy and without signs of inflammation. Restorative space is adequate to proceed without\n enameloplasty.\n\n Attached floss to hand-driver and placed gauze throat pack. Removed healing abutment with hand driver. Tightened closed-tray impression coping\n onto intraoral implant with hand driver. Took BW to verify seating. Achieved good isolation & took closed-tray final impression using heavy body\n PVS & medium body PVS. Removed impression coping and replaced healing abutment with hand driver.\n\n Selected shade A2 for #13 STI crown. Pt used hand mirror & confirmed shade verbally.\n\n Took alginate impression of lower arch. Took bite registration with Regisil.\n\n NV:",
 "4685": " - y/o female patient presents to Chicago clinic for #13 STI custom abutment try-in\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI custom abutment try-in:\n\n Tissue surrounding #13 healing abutment is healthy and without signs of inflammation. Restorative space is adequate to proceed without\n enameloplasty.\n\n Attached floss to hand-driver and placed gauze throat pack. Removed healing abutment with hand driver. Tightened custom abutment onto\n intraoral implant with hand driver. Took BW to verify seating.\n\n Evaluated custom abutment for axial reduction, taper, path of draw, emergenc profile, margin location & width, adequate restorative space\n (mesiodistally, buccolingually, & occlusally). Custom abutment is ideal to proceed with crown fabrication.\n\n Removed custom abutment and replaced healing abutment with hand driver.\n\n Selected shade A2 for #13 STI crown at last visit, confirmed shade today. Pt used hand mirror & confirmed shade verbally.\n\n NV: #13 STI custom abutment & crow delivery",
 "4812": " - y/o female patient presents to Chicago clinic for #13 STI custom abutment & crown delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI custom abutment & crown delivery:\n\n\n NV:",
 "5004": " - y/o female patient presents to Chicago Digital clinic for #19-MO digital e.max inlay prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MO digital e.max inlay prep & scan:\n Completed inlay prep to ideal form. Scanned prep, opposing arch, & occlusion using TRIOS intraoral scanner. Verified margins, occlusal clearance,\n & interproximal contacts on scan.\n\n Selected shade HT-A2 for #19 digital inlay. Pt used hand mirror & confirmed shade verbally.\n\n #19-MO provisional:\n Provisionalized #19-MO inlay with Telio. Shaped & light-cured 20s. Occlusal & excursive contacts evaluated with articulating paper & adjusted to\n ideal — pt is not occluding on Telio.\n\n NV: #19-MO digital e.max inlay delivery",
 "5032": " - y/o female patient presents to Chicago Digital clinic for #19-MODB digital e.max onlay prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MODB digital e.max onlay prep & scan:\n Completed onlay prep to ideal form. Scanned prep, opposing arch, & occlusion using TRIOS intraoral scanner. Verified margins, occlusal clearance,\n & interproximal contacts on scan.\n\n Selected shade HT-A2 for #19 digital onlay. Pt used hand mirror & confirmed shade verbally.\n\n #19-MODB provisional:\n Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp.\n Removed excess cement & flossed. Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts\n evaluated with floss & are satisfactory.\n\n NV: #19-MODB digital e.max onlay delivery",
 "5062": " - y/o female patient presents to Chicago Digital clinic for #19 digital e.max crown prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 digital e.max crown prep & scan:\n Completed crown prep to ideal form. Placed #00 &#0 gingival retraction cord soaked in Hemodent. Scanned prep, opposing arch, & occlusion using\n TRIOS intraoral scanner. Verified margins, occlusal clearance, & interproximal contacts on scan.\n\n Selected shade LT-A2 for #19 digital crown. Pt used hand mirror & confirmed shade verbally.\n\n #19 provisional:\n Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp.\n Removed excess cement & flossed. Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts\n evaluated with floss & are satisfactory.\n\n NV: #19 digital e.max crown delivery",
 "5305": " - y/o female patient presents to Vivaldi clinic for #19-MODB digital e.max onlay delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MODB digital e.max onlay delivery:\n\n Removed sprue & prepared onlay for pre-crystallization try-in. Placed Isodry (size M). Removed provisional onlay. Removed temporary cement with\n a scaler. Cleaned tooth with pumice & prophy angle\n\n Pre-crystallization try-in:\n - Marginal adaptation satisfactory; verified visually, tactilely, & radiographically (BW taken).\n - Interproximal contacts adjusted with a bur; contacts are satisfactory as evaluated with floss.\n - Occlusal & excursive contacts adjusted with a bur; contacts are satisfactory as evaluated with articulating paper.\n\n Crystallization try-in:\n - [ Stains added? ]. Crystallized using regular glaze and regular firing cycle. [ spray glaze and speed firing cycle ]\n - Crystallized restoration tried in. Adjusted [surfaces].\n - Pt expressed satisfaction with final shade of restoration.\n - Total number of restorations milled: 1 [reason]\n\n Cementation -- Panavia F2.0 resin cement:\n - Restoration intaglio cleaned with Ivoclean 20s, rinsed, dried; etched with 5% HF acid 20s, rinsed, dried; primed with Clearfil ceramic primer 1m,\n dried.\n - Tooth isolated with Isodry. Scrubbed with Consepsis, rinsed, dried; primed with Primer A+B 30s, dried.\n - Mixed Panavia cement pastes A&B (shade TC). Cemented restoration. Removed excess cement. Flossed. Light cured 20s per side.\n - Took BW to verify closed margins. Verified interproximal contacts. Evaluated & adjusted occlusal contacts & excursive contacts to ideal. Polished\n ceramic.\n - Pt is satisfied with bite & esthetics. Gave verbal post-op instructions re: 24 hr set, uneven bite, sore injection site.\n\n NV:",
 "5472": " - y/o female patient presents to UG clinic for #12 RCT -- same day access & fill\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n CC: “My upper left tooth hurts and I was referred here for a root canal”\n\n Re-confirmed findings from endo consult visit 1/1/2021 1 month ago:\n - EOE: WNL -- no lymphadenopathy, no swelling, no erythema, no asymmetries\n - IOE: WNL -- no soft tissue pathology, no sinus tract, no vestibular swelling\n - hard tissue exam: #12 existing DO composite with recurrent decay\n - symptoms: pain on chewing\n - #12 is restorable as confirmed with Dr. ?\n\n Endo tests:\n - #: percussion +++, palpation +++, probing X mm, mobility 1, cold test NR\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n\n Radiographic exam:\n - Re-evaluated BW & PA taken 1/1/2021\n - Periapical radiolucency #12\n - #12 large DO composite approaching pulp, recurrent decay\n\n Diagnosis #12:\n - Pulpal dx: necrotic pulp\n - Periapical dx: symptomatic apical periodontitis\n\n Thoroughly reviewed treatment options, timelines, & costs with the pt. Discussed advantages & disadvantages of treatment. Answered pt’s\n questions, pt understood tx options. Pt opts to proceed with RCT #12. Specifically discussed need for pt to return to primary dentist for a crown.\n Verbal & written consent obtained.\n\n #12 RCT:\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #12.\n\n Rubber dam placed. Excavated caries completely. Accessed, completely unroofed pulp chamber, & achieved straight-line access. Located 2 canals.\n Pre-flared with Vortex orifice opener #20/.08. Determined WL with electronic apex locator. Confirmed WL with WM radiograph taken straight and\n from distal. Created guide path with #10, #15 SS files. Cleansed & shaped canals with powered rotary files. Reconfirmed patency and copious\n irrigation with 1% NaOCl throughout procedure. Fitted mater cones and took radiograph.\n\n Buccal canal -- WL 18.5 mm (reference point: buccal cusp tip)\n Palatal canal -- WL 18.0 mm (reference point: lingual cusp tip)\n MAF: 35 (buccal & palatal)\n\n Final irrigation with 1% NaOCl, 17% EDTA, 1% NaOCl. Dried canals with needle aspiration and paper points. Obturated with Endoseal MTA sealer and\n master cone. Took post-op radiograph. Placed sponge & Cavit.\n\n POI given verbally. Pt tolerated procedure well and left in stable condition.\n\n - NV:",
 "5985": " - y/o female presents to UG Peds with mother for initial/recall appt.\n - RMH with mother. No changes.\n - , no medications, IUTD\n - dental history: brushes 2x a day, flosses 1x a week, mother helps with brushing & flossing\n - caries risk: HIGH\n\n Completed extraoral & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology, generalized mild gingivitis, generalized moderate plaque\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n Took 4 bitewings & updated odontogram with radiographic & intraoral hard tissue findings:\n - mixed dentition\n -\n - occlusal assessment:\n\n Treatment planned for the following treatments:\n -\n Findings & treatment options, advantages & disadvantages, reviewed with parent. Treatment plan formulated & discussed, all questions were\n answered. Mother signed treatment plan.\n\n Prophy completed.\n - Removed plaque & calculus using hand instruments. Flossed. Polished with prophy paste.\n - Fluoride varnish applied.\n - OHI given; brushing & flossing were demonstrated with mother & pt; advised to brush 2x daily + floss 1x daily\n - Nutritional counseling completed. Advised to limit sugary drinks & snacks, and when consumed, to shorten duration.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "6038": " Discussed with parent and patient the disadvantages of SDF, including: staining carious lesions black (showed pictures), possible transient soft\n tissue staining, failure to arrest caries with future need for restoration. Parent understood risks and consented to SDF placement.\n\n Isolated with cotton rolls. Thoroughly dried teeth. Applied SDF to #A in a scrubbing motion. Allowed 60s to air dry. Removed excess SDF & rinsed.",
 "6095": " - y/o female presents to UG Peds with mother for #3, #14, #19, #30 sealants\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Sealants — #3, #14, #19, #30\n Tooth cleaned with pumice & prophy angle. Isodry placed (size P). Etched with 35% phosphoric acid for 30s, rinsed 15s, gently dried. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit of mandibular molars /\n lingual groove of maxillary molars. Light cured 20s. Repeated for all molars (#2, #3, #14, #15, #18, #19, #30, #31). Occlusion evaluated with\n articulating paper -- occlusion is satisfactory, pt is not occluding on sealant.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "6173": " - y/o female presents to UG Peds with mother for #A-MO preventative resin restoration\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right/ buccal infiltration #A.\n\n #A-MO PRR\n Placed Isodry (size P). Excavated shallow decay using high & slow speed burs. Prepared cavity preparation to ideal form. Etched with 35%\n phosphoric acid for 15s, rinsed 5s, gently dried. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill\n composite in increments, each cured 20-40s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit / lingual groove, light cured 20s.\n Restoration finished & polished. Occlusion evaluated with articulating paper & adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "6284": " - y/o female presents to UG Peds with mother for #A-O composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-O\n Placed Isodry (size P). Removed existing failing O amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation\n to ideal form. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried\n 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "6406": " - y/o female presents to UG Peds with mother for #A-MO composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-MO\n Placed Isodry (size P). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. / Gold matrix band placed. Etched with 35% phosphoric\n acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel\n nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy\n brush. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "6529": " - y/o female presents to UG Peds with mother for #E-MF composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-MF\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "6644": " - y/o female presents to UG Peds with mother for #E-MIFL composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-MIFL\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "6759": " - y/o female presents to UG Peds with mother for #E-B composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-B\n Placed Isodry (size P). Removed existing failing B RMGI restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation to\n ideal form. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s,\n cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "6880": " - y/o female presents to UG Peds with mother for #A-O amalgam\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-O\n Placed Isodry (size P). Completely removed failing existing O amalgam restoration and excavated decay using high & slow speed burs. Prepared\n cavity preparation to ideal form. Applied Gluma in scrubbing motion for 10s then rinsed thoroughly. Placed gold matrix band. Delivered,\n overfilled, & condensed amalgam. Removed excess & carved amalgam to ideal anatomic form. Interproximal contact evaluated with floss &\n adjusted to ideal. Occlusion evaluated with articulating paper & adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Mother was informed that patient is still numb & to\n monitor lip and soft tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "6991": " - y/o female presents to UG Peds with mother for #A SSC\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A SSC\n Placed bite block & rubber dam / Isodry placed (size P). Completely removed failing existing MOD composite restoration & excavated D decay\n using high & slow speed burs. Completed crown prep to ideal form. Tried on SSC #5; trimmed & crimped to ideal fit. Confirmed occlusion.\n Confirmed crown margins with BW radiograph. Cemented crown with GIC FujiCEM & seated using a bite stick. Excess cement cleaned, flossed.\n Re-confirmed occlusion.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "7139": " - y/o female presents to UG Peds with mother for #A pulpotomy & SSC\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A pulpotomy\n Placed bite block & rubber dam. Completely removed failing existing MOD composite restoration and excavated decay using high & slow speed\n burs. Pulp chamber accessed & unroofed completely. Amputated coronal pulp tissue. Hemostasis achieved via moist cotton pellet followed by\n Viscostat for 10s & thorough rinsing. Hemostasis confirmed. IRM placed.\n\n #A-SSC\n Completed crown prep to ideal form. Tried on SSC #5; trimmed & crimped to ideal fit. Confirmed occlusion. Cemented crown with GIC FujiCEM &\n seated using a bite stick. Excess cement cleaned, flossed. Re-confirmed occlusion.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "7242": " - y/o female presents to UG Peds with mother for #F composite strip crown\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block / buccal infiltration #F.\n\n #F composite strip crown\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Completed crown prep to\n ideal form. Strip crown selected & fitted to tooth. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Loaded shade A2 Renamel nanofill into strip crown, seated crown, cured 60s. Finished\n restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to\n ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr.",
 "7306": " - y/o female presents to UG Peds with mother for band & loop impression\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n #36 band fit to #30 with band seater. Pick-up impression taken in alginate.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.",
 "7399": " - y/o female presents to UG Peds with mother for #30-#S band & loop cementation\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n #30-#S band & loop cementation\n Band & loop #30-#S tried in. Occlusion evaluated with articulating & is satisfactory; band & loop does not interfere with occlusion. #30 & #S\n cleaned with prophy cup & pumice. Band & loop cemented with FujiCem.\n\n Post-op instructions reviewed with mother — soft diet today, soreness for 24hr, excess saliva, temporary speech disturbance, OHI, loss of\n appliance. Pt released in good condition.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
};

const CHUNKS = [
{
"id": "c001",
"section": "RESTORATIVE",
"title": "RESTORATIVE",
"body": "AMALGAM\n      COMPOSITE — CLASS I\n      COMPOSITE — CLASS II\n      COMPOSITE — CLASS III\n      COMPOSITE — CLASS IV\n      COMPOSITE — CLASS V\n      COMPOSITE VENEERS\n      RMGI\n      SEALANTS\n      OCCLUSAL GUARD"
},
{
"id": "c002",
"section": "FIXED",
"title": "FIXED",
"body": "CORE BUILDUP + CROWN PREP + PROVISIONAL + FINAL IMPRESSION\n      CORE BUILDUP\n      CROWN PREP\n      PROVISIONAL CROWN\n      CROWN FINAL IMPRESSION\n      CROWN DELIVERY\n      CROWN REMOVAL\n      CROWN ENDO ACCESS FILL"
},
{
"id": "c004",
"section": "DENTURES",
"title": "DENTURES",
"body": "DENTURE RESOURCES\n   DENTURE STEPS\n   DENTURE #1: COE & DIAGNOSTIC IMPRESSIONS\n   DENTURE #2: BORDER MOLDING & FINAL IMPRESSION\n   DENTURE #3: WAX RIMS\n   DENTURE #4: ANTERIOR TRY-IN\n   DENTURE #5: POSTERIOR TRY-IN\n   DENTURE #6: DELIVERY\n   DENTURE #7: ADJUSTMENT\n   LAB RELINE"
},
{
"id": "c008",
"section": "PEDS",
"title": "PEDS",
"body": "PEDS INFO\n   TOOTH ERUPTION\n   PEDS INITIAL/RECALL\n   SDF (SILVER DIAMINE FLUORIDE)\n   SEALANTS\n   PRR (PREVENTIVE RESIN RESTORATION)\n   PEDS COMPOSITE — CLASS I\n   PEDS COMPOSITE — CLASS II\n   PEDS COMPOSITE — CLASS III\n   PEDS COMPOSITE — CLASS IV\n   PEDS COMPOSITE — CLASS V\n   PEDS AMALGAM\n   STAINLESS STEEL CROWN (SSC)\n   PULPOTOMY\n   STRIP CROWN\n   SPACE MAINTAINER"
},
{
"id": "c009",
"section": "REFERENCES",
"title": "REFERENCES",
"body": "BLOOD PRESSURE\n   COMMON MEDICATIONS\n   CARIES DIAGNOSIS (ADA)\n   MATERIALS\n   ENDODONTIC DIAGNOSIS\n   ENDODONTIC TESTING\n   LOCAL ANESTHETIC\n   MAXILLARY ANESTHESIA\n   MANDIBULAR ANESTHESIA\n   DIAGRAMS FOR PATIENTS\n   OHI\n   ANTIBIOTIC PROPHYLAXIS\n   BISPHOSPHONATES\n   PREGNANT PATIENTS\n   COMMON PRESCRIPTIONS"
},
{
"id": "c010",
"section": "POLICIES",
"title": "POLICIES",
"body": "PHONE NUMBERS\n   AFTER HOURS EMERGENCY\n   INCIDENTS (OCCURRENCES)\n   PATIENT FAILURE, INACTIVATION, & DISMISSAL\n   PATIENT RECORDS"
},
{
"id": "c011",
"section": "AXIUM",
"title": "AXIUM",
"body": "LAB SCRIPT\n   PRESCRIPTIONS\n   MEDICAL CONSULTATION\n   REFERRALS\n   NO-SHOW / CANCEL <24 HRS\n   PREVIDENT, CHLORHEXIDINE, MI PASTE\n   TOBACCO CESSATION\n   PROSTHETIC JOINT FORM\n   ADDING PHOTOS & RADIOGRAPHS\n   CREATING A NEW PERIO CHART\n   AXIUM eRx (MEDICATIONS & ALLERGIES)\n   CALLING PATIENTS\n   BOOKING A CHAIR\n   CONTACT NOTE\n   REMOVING AN AXIUM ABSENCE"
},
{
"id": "c012",
"section": "EXAMS",
"title": "START CHECK",
"body": "start check: steps\n     1.​ get the patient\n              ○​ once a patient checks in at the front desk, their name appears red in Axium\n                        ■​ sometimes Axium doesn’t auto-refresh; try closing & re-opening the schedule, or clicking “Today” on the\n                            bottom left of the schedule,, or try searching your pt’s name in the Rolodex\n              ○​ pick up the patient from the waiting room & walk them back to the unit\n     2.​ seat the patient\n              ○​ depending on what procedure you’re doing, seat the patient either in the assistant chair next to you (so you can\n                   talk more easily), or in the dental chair\n              ○​ if you need to ask a lot of questions / fill out a long form / talk for a while, seat the pt in the assistant chair next to\n                   you so that you can face them during the conversation (instead of talking to the back of their head)\n              ○​ if you only need to ask “any changes in your medical history?” seat them in the dental chair\n     3.​ explain today’s visit\n     4.​ update med history\n              ○​ ask your pt if there’s been any changes in their medical history or medications\n                        ■​ make changes as needed\n              ○​ if no changes, ensure the date is updated to today in the “Medical History” tab next to “Health History Reviewed”\n              ○​ it’s important that you update the date, because after 6 months without updating, Axium will put a “soft lock” on\n                   the chart, which will prevent you from completing treatment codes\n\n            ○​ make any changes to medications & allergies as needed; you don’t need to update the date for this if the pt has no\n                  changes (no alert/lock like medical history)\n    5.​ take vitals\n            ○​ blood pressure for all patients\n            ○​ blood glucose for diabetic patients\n            ○​ enter vital signs in “Medical History” tab\n    6.​ check in\n            ○​ present case to instructor to obtain start check\n            ○​ “My patient is an [age] year old [male/female] here today for [this procedure]. Her blood pressure is [this]. She has\n                  [these conditions]. She is taking [these medications]. She is allergic to [this].”"
},
{
"id": "c013.0",
"section": "EXAMS",
"title": "SCREENING — for a patient to schedule a screening appointment",
"body": "for a patient to schedule a screening appointment\n     ●​ screening to become a comprehensive patient is by appointment only\n     ●​ to schedule a screening, the potential patient should call: (312) 996-1265\n              ○​ the screening phone line is open Monday through Friday at 9:30 AM and remains open until all appointments are\n                   filled, usually ending at 1:30 pm\n     ●​ screening appointments are offered during both morning and afternoon sessions\nscreening family members / planning a screening with a specific patient\n    1.​ send pt to registration (1st floor) → pt should tell front desk that they have a student in [clinic] who will be screening them\n    2.​ after they have been registered (they have an Axium number), registration will send them to the 2nd floor to fill out a\n        screening sheet with Mickey\n    3.​ after they have filled out the screening sheet, you will call them in & screen them\nscreening: equipment\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: disposable plastic mirror\nscreening: steps\n    1.​ seat patient\n             ○​ get the patient from the waiting room & seat them in the assistant chair next to you\n    2.​ go through screening sheet\n             ○​ write chief complaint, in the pt’s own words, on the screening sheet\n             ○​ review the patient’s medical history that they’ve written on the screening sheet (do not enter anything in Axium)\n    3.​ explain school policies\n             ○​ explain how the appointments work!!!\n                     ■​ appointments will generally last 3 hours\n                     ■​ the patient will require 4 initial appointments (radiographs, perio COE, restorative COE, treatment plan)\n                          before any treatment will be started — warn them that these appointments will last 3 hours each (they\n                          may be shorter, but sometimes they do take the whole time)\n             ○​ comprehensive & sequenced treatment is required\n                     ■​ we cannot just do the 1 crown the patient wants, we have to treat the whole mouth in proper tx. order\n             ○​ all payment is required at the beginning of treatment\n                     ■​ the school does not accept payment plans\n                     ■​ the patient will not need to pay for the entire treatment plan at the first appointment; they pay as they go\n                          for the treatment they will be having that day\n             ○​ the patient needs to keep their scheduled appointments\n                     ■​ less than 24 hours notice to cancel/reschedule an appointment counts as a failed appointment\n                     ■​ if the patient fails their first appointment, they will be dismissed\n                     ■​ if the patient fails 3 appointments, they will be dismissed\n                     ■​ if a patient cannot keep an appointment, they need to notify at least 24 hours before\n             ○​ a patient cannot bring their children under 14 with them to their appointment\n             ○​ it may take 6-8 weeks for the patient to be assigned to a student (exception: if you’re accepting the patient for\n                 yourself right now, they’re assigned usually within 2 weeks)\n    4.​ perform oral exam\n             ○​ move the patient to the dental chair & take a super fast look in their mouth (use a plastic mirror in the unit)\n             ○​ on the screening sheet, circle what types of care the patient will require\n    5.​ approve patient\n             ○​ D0147 (screening N/C)\n             ○​ before planning the 3 codes below, check Dexis to see if pt already has FMX or pan; then ask patient if they’ve had\n                 FMX or pan recently & are able to acquire it (you won’t need to plan these codes then)\n             ○​ plan (P) 3 codes:\n                     ■​ D0150 (COE)\n                     ■​ D0330 (Panoramic film)\n                     ■​ D0210 (Intraoral - complete series)\n             ○​ write your note now before your instructor comes over\n    6.​ present the patient to instructor\n             ○​ make sure the instructor signs the screening sheet\n\n              ○​ have the instructor swipe your codes/note\n    7.​ if pt is not approved\n              ○​ if the patient is not approved, provide the appropriate referrals (providers outside UIC, GPR list, UIC PG programs)\n                        ■​ you can get a sheet of paper that has the referral list from your clinic manager / in your clinic\n              ○​ if patient is being referred to a UIC PG clinic, complete a referral through Axium\n    8.​ take patient to radiology\n              ○​ take the patient to radiology to have them take a panoramic x-ray same day (they can schedule it for later if they\n                   don’t want to take it today)\n                        ■​ take off your gown before you go down to radiology\n                        ■​ you will need the patient’s Axium number, so bring the screening sheet\n                        ■​ the patient may also get the FMX taken that day if radiology has an opening (usually they are booked); the\n                            patient may choose to come back & schedule the FMX for another day (they aren’t required to get the\n                            FMX same day)\n              ○​ once the patient is done checking in with radiology, you can leave & return to your clinic, and the patient can leave\n                   after they’ve taken their x-rays (or after scheduling, if they don’t want to take x-rays same day)\n    9.​ return screening sheet to Mickey\n              ○​ if you want the patient assigned to you, write “Please assign patient to [name]” on bottom of the screening sheet\nscreening: note template\n  y/o female presents to UIC COD for screening appointment. Pt’s CC: “ .” Reviewed medical history. Performed oral inspection. Explained college\n policies, including attendance, transportation, & financial policy. Patient is provisionally accepted to UG clinic.\n\n Planned COE, FMX, pan.\n\n NV: COE"
},
{
"id": "c014.0",
"section": "EXAMS",
"title": "URGENT CARE — urgent care: equipment",
"body": "urgent care: equipment\n    ●​ from sterilization: exam kit, radiograph kit, blood glucose meter, electric pulp tester (with tip & toothpaste), patient goggles,\n        blood glucose kit\n    ●​ from locker: blood pressure cuff, pen, loupes and/or eye protection\n    ●​ in unit: EndoIce, cotton swab"
},
{
"id": "c014.1",
"section": "EXAMS",
"title": "URGENT CARE — urgent care: steps",
"body": "urgent care: steps\n    1.​ before you seat patient\n              ○​ check in early (9:15 or 1:15) with Mickey at the front desk (2nd floor) to get a patient assigned to you\n              ○​ set up your chair, then look up the patient’s medication history (Axium eRx → Med Hx tab → Obtain New Data)\n    2.​ seat patient\n              ○​ get the patient from the waiting room (2nd floor) & seat them in the assistant chair next to you (easier to talk)\n              ○​ remind the patient what will happen at today’s appointment:\n                       ■​ today’s appointment is to evaluate & diagnose this problem\n                       ■​ we cannot promise treatment today — we might need to schedule you another day to come back for\n                           treatment\n                       ■​ we have to focus on your emergent complaint — we cannot solve all the pt’s chief complaints; choose the\n                           one that is most painful\n                       ■​ for wisdom tooth patient: warn pt NOW that the soonest we can get them in is likely 3-4 months for a\n                           consult appointment then potentially another 2-3 months after that for surgery (4-8 mo. for surgery)\n    3.​ interview the patient about their CC\n              ○​ inception & provocation: what brings about the pain? does hot, cold, biting bring about the pain? is it\n                  spontaneous? is it lingering? has the patient had recent dental treatment? is there a postural component? is there\n                  a thermal component? is there a biting component?\n              ○​ attenuating factors: does anything relieve the pain? can analgesics take away the pain? how much & how often?\n                  when was the last time you took pain medication?\n              ○​ frequency & duration: how often does it hurt you? does it hurt for a long time?\n              ○​ intensity: does it wake you up? on a scale of 1-10 how painful is it? what kind of pain is it (throbbing, sharp, dull)?\n              ○​ symptoms: do you have swelling? tenderness? bleeding? bad taste?\n              ○​ location: can the patient locate the pain?\n    4.​ check in (Hanna only) — present pt name, age, gender, chief complaint, & if the patient has swelling (extraoral or intraoral)\n    5.​ update forms (2): med hx + medications/allergies\n              ○​ complete the patient’s medications & allergies in Axium eRx\n              ○​ under “Forms” tab, add EPR (plus sign on right) → complete the “Medical History” tab only\n    6.​ take blood pressure​\n         ​        move the patient to the dental chair & take blood pressure & pulse (blood glucose if indicated) — enter into Axium\n    7.​ check in — present vital signs, medical history, medications, allergies (if this is your first check in, include info above)\n    8.​ perform intraoral exam\n              ○​ perform endodontic testing if indicated (percussion, palpation, probing depth, mobility, cold test, EPT)\n              ○​ how to endo test\n    9.​ determine which radiographs you want to prescribe (usually 1 BW + 1 PA for single-tooth issues; pano for wisdom teeth)\n    10.​ check in — present your findings & which radiographs you want to prescribe\n    11.​ take radiographs\n              ○​ if you take PA + BW: complete codes D0220 (Intraoral - periapical 1st film) and D0270 (bitewing - single film)\n              ○​ if pt needs pano: plan (do not complete) the code D0330 (Panoramic film) & have it swiped by instructor\n                       ■​ take your gown off before going to radiology\n                       ■​ bring screening sheet with you so you have their Axium number\n                       ■​ walk the patient to radiology & have them pay and take pan\n                               ●​ if patient needs a panoramic radiograph but does not need a bitewing & PA, they can apply the\n                                    fee for the bitewing & PA toward the cost of the pan; the difference is $28 more for the pan;\n                                    sometimes insurance will cover the pan\n                       ■​ walk pt back up to clinic\n    12.​ assess\n              ○​ formulate a diagnosis, plan, & treatment options\n              ○​ pericoronitis:\n                       ■​ mild — localized tissue redness & swelling, soreness, recurrent\n                       ■​ moderate — guarded jaw opening, inflammation in muscles of mastication, pus, pain\n\n                    ■​ severe — trismus (opening less than 20 mm), fever, malaise, facial or extraoral swelling\n13.​ check in — have the instructor look at the radiographs; present diagnosis, plan, & treatment options\n14.​ obtain consults if tooth will be restored\n          ○​ restorative faculty must confirm that tooth is restorable — document with instructor names\n          ○​ periodontal faculty must confirm that tooth is restorable — document with instructor names\n15.​ refer or treat\n          ○​ make appropriate referrals or perform appropriate treatment\n          ○​ if you will perform treatment today, plan (P) the appropriate codes & escort patient to front desk for payment\n          ○​ if you are referring to OS:\n                    ■​ print the radiograph(s), leave patient in chair, go to UG OS & fill out top part of neon sheet (there’s a stack\n                        of neon sheets on a clipboard, usually at the UGOS front desk or inside UGOS at the faculty desk)\n                    ■​ present the case to a UG OS instructor (age, gender, CC, BP, health history) & give them the printed\n                        radiograph and completed neon sheet\n                    ■​ if accepted to UG OS, schedule with UG OS front desk\n                    ■​ if UG OS tells you to go to PG OMFS: go back to clinic → get your patient → bring pt down to PG OMFS →\n                        have pt schedule appointment with PG OMFS front desk\n16.​ complete codes & note\n          ○​ D0140 (Limited oral eval - problem focused) & complete any other codes performed\n          ○​ D0220 (Intraoral - periapical 1st film)\n          ○​ D0270 (Bitewing - single film)\n          ○​ attach a note using the template found in Axium (SOAP note)\n                    ■​ add a note to the code like normal (right click code → click “Add Tx Note…”)\n\n                 ■​ click the ellipses “...” next to Code\n                 ■​ double click 00140 UC template to add it to your note\n17.​ check in — have instructor check your work & swipe your EPR/codes/notes"
},
{
"id": "c014.2",
"section": "EXAMS",
"title": "URGENT CARE — urgent care: note template",
"body": "urgent care: note template\n S\n - y/o female patient presents to Urgent Care in Vivaldi clinic with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n HPI:\n -\n - location:\n - inception:\n - triggers:\n - spontaneous pain:\n - lingering pain:\n - pain wakes pt up at night:\n - quality:\n - frequency:\n - duration:\n - intensity:\n - other symptoms:\n - treatment/evaluation thus far:\n - relief:\n - last pain medication taken & effectiveness:\n - anything else?:\n\n O\n\n EOE:\n Pt appears generally healthy in the dental chair. No visible asymmetries. EOE WNL with normal skin texture and color, normal facial movements,\n no visible/palpable masses, no lymphadenopathy, normal facial muscle movement & palpation, and normal TMJ movement and palpation\n bilaterally.\n\n IOE:\n - (heavily restored / carious dentition), (complete dentition / partially edentulous), (heavy calculus & active periodontal disease)\n -\n - Lips, gingiva, buccal mucosa, tongue, floor of mouth, oropharynx are all WNL without signs of pathology, asymmetry, or swelling\n\n Radiographs:\n - BW & PA taken\n - Radiographs reveal\n - Radiograph otherwise unremarkable & free of pathology\n\n Endo testing:\n - #: percussion +++, palpation +++, probing X mm, mobility 1, cold test 0.5/20 s\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n\n Consultations:\n - Dr. [Name] -- restorative consult:\n - Dr. [Name] -- perio consult:\n - Dr. [Name] -- OS consult:\n\n A\n Endo diagnoses:\n - Pulpal diagnosis #:\n - Periapical diagnosis #:\n\n P\n Thoroughly discussed treatment options, costs, & timelines with pt. Specifically discussed tx options: (1) no treatment, (2) RTC + potential\n post/CBU/crown lengthening + crown, (3) extraction + replacement options (implant/bridge/RPD). Discussed advantages & disadvantages of\n treatments. Pt’s questions were answered & pt understood treatment options. Pt opts for .\n\n NV:"
},
{
"id": "c014.3",
"section": "EXAMS",
"title": "URGENT CARE — urgent care wisdom tooth: note template",
"body": "urgent care wisdom tooth: note template\n S\n - y/o female patient presents to Urgent Care in Vivaldi clinic with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n\n HPI:\n\n O\n - IOE reveals\n - Panoramic radiograph taken & reveals . Radiograph otherwise unremarkable & free of pathology.\n\n A\n - [mild/moderate/severe] pericoronitis\n\n P\n Pt referred to PGOS for extraction #1, #16, #17, #32. Consult appointment scheduled for .\n\n NV:"
},
{
"id": "c015",
"section": "EXAMS",
"title": "COE",
"body": "●​ COE = comprehensive oral examination\n      ●​ a COE is completed on all new patients at UIC COD that have not been seen before\n              ○​ screening appointment → patient is accepted → patient goes to radiology for radiographs → COE appointments\n      ●​ the patient must have a pano & FMX completed before the COE\n              ○​ pt can bring copies of recent FMX/pan from outside dentist, but they must be of good enough quality to be\n                   diagnostic\n      ●​ a COE consists of 3 parts:\n              1.​ perio COE\n              2.​ restorative COE\n              3.​ treatment plan presentation\n      ●​ usually the perio COE is done before the restorative COE, so that the restorative instructors are able to take the perio\n         diagnosis into consideration\n              ○​ this isn’t a rule though — it’s ok to do the restorative COE first if you have to (ex: if perio chairs are all booked up\n                   and you have an open restorative chair)\n      ●​ the perio COE must be completed in a perio chair\n      ●​ the restorative COE should be completed in a restorative chair, however can be completed in a perio chair after the perio\n         COE if restorative faculty is available (usually OK, before you start the restorative COE, just ask a restorative instructor who is\n         free if they have time to help you)\n      ●​ the instructor you do the restorative COE with will be the instructor you do the treatment plan presentation with, and also\n         the instructor you will do all phase 3 work with\n      ●​ take diagnostic impressions at the perio COE — this way, if they don’t turn out or you need to retake, you have the\n         restorative COE appointment to retake before you need diagnostic casts at the tx planning appointment"
},
{
"id": "c016.0",
"section": "EXAMS",
"title": "PERIO COE (1) — perio COE: equipment",
"body": "perio COE: equipment\n    ●​ from sterilization: exam kit, facebow, Regisil gun, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, alginate mixing bowl, spatula\n    ●​ in clinic: alginate, water cylinder, impression trays, alginate spray adhesive, Regisil + tip"
},
{
"id": "c016.1",
"section": "EXAMS",
"title": "PERIO COE (1) — perio COE: steps",
"body": "perio COE: steps\n    1.​ before you seat patient\n             ○​ before you call in the patient, look up patient’s medication history (Axium eRx → Med Hx tab → Obtain New Data)\n             ○​ mark teeth missing on odontogram based on pan\n    2.​ seat patient\n             ○​ get the patient from the waiting room & seat them in the assistant chair next to you\n             ○​ explain to the patient what will happen at today’s appointment\n             ○​ remind the patient the sequence of appointments (perio COE, restorative COE, tx plan)\n    3.​ complete forms (3): medications/allergies + med hx + tobacco cessation\n             ○​ complete the patient’s medications & allergies in Axium eRx — ensure date is updated\n             ○​ under “Forms” tab, add EPR (plus sign on right) → complete the “Medical History” tab only\n                      ○​ ensure the date is updated next to “Health History Reviewed”\n             ○​ if the patient is a smoker, complete 2 tobacco codes:\n                      ○​ D1320.1 (Record Tobacco Usage) — follow the pop-up prompts to add the tobacco form\n                      ○​ D1320.2 (Provide Tobacco Cessation Education)\n                      ○​ at next apt you can complete 3rd code, D1320.3 (Tobacco Cessation Follow Up with Patient)\n    4.​ take blood pressure\n             ○​ move the patient to the dental chair & take blood pressure & pulse (blood glucose if indicated) — enter into Axium\n    5.​ check in\n             ○​ present the patient’s name, age, gender, vital signs, medical history, medications, allergies, procedure for today\n    6.​ complete a new perio chart\n             ○​ create a new perio chart (Perio Chart → plus sign at top → select “Perio COE” next to “Exam Type”)\n             ○​ complete all fields of the perio chart\n                      ○​ probing depths\n                      ○​ bleeding on probing\n                      ○​ free gingival margin\n                      ○​ mucogingival deformities/defects\n                      ○​ mobility\n                      ○​ furcation involvement\n    7.​ complete the perio EPR\n             ○​ under the EHR “Forms” tab, add the “Periodontic EPR” form (plus sign on right)\n             ○​ complete the first 4 tabs of the perio EPR: “Periodontal Exam”; “Diagnosis”; “Prognosis”; “Treatment Plan”\n                      ○​ the “Diagnosis” tab walks you through formulating a diagnosis, but if you need to reference the info\n                           sheets, you can find them in Links → “Staging and Grading for Periodontitis”\n    8.​ complete codes & note\n             ○​ D0150A (Initial Assessments)\n                      ○​ if you completed restorative COE before perio COE, complete code D0150B (Additional Assessments)\n             ○​ D0475 (Diagnostic Casts -- N/C)\n             ○​ D1320.1 (Record Tobacco Usage)\n             ○​ D1320.2 (Provide Tobacco Cessation Education)\n             ○​ make sure you enter the perio treatment plan into the pt’s overall treatment plan in the EHR “Treatment Plan” tab\n                 (in addition to what you already did today, which is filling out the Perio EPR “Treatment Plan” tab under “Forms”)\n    9.​ check in\n             ○​ present your findings to instructor; diagnosis, perio treatment plan, referral to PG perio\n             ○​ have instructor swipe: perio chart, EPR forms, appointment code + note\n    10.​ plaque disclosure\n             ○​ at this point, some instructors will ask you to do plaque disclosure with disclosing tablet or disclosing solution then\n                 enter the surfaces with plaque in the perio chart — wait until instructor asks you to do this, because most won’t\n                 have you do it\n    11.​ take mounting records\n             ○​ take a facebow on any patient whose casts you will mount (phase 2 or phase 3 treatment)\n                      ○​ a facebow record allows you to mount the maxillary cast\n\n              ○​ take a bite registration for any casts you will not be able to hand articulate\n                       ○​ a bite registration allows you to mount the mandibular cast against the maxillary in cases where hand\n                           articulation is not possible\n                       ○​ if the patient does not have any posterior teeth in occlusion, you will need to make wax rims in the lab &\n                           bring the patient back for another appointment to take bite registration on the wax rims in order to\n                           mount the casts\n     12.​ take impressions\n              ○​ if the patient requires phase 2 or phase 3 treatment, take diagnostic impressions — take impressions at very end of\n                  appointment, you need to pour them within 15 minutes of taking them"
},
{
"id": "c016.2",
"section": "EXAMS",
"title": "PERIO COE (1) — perio COE: note template",
"body": "perio COE: note template\n S\n\n - y/o female patient presents to Vivaldi clinic for Perio COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: last time at dentist: ; brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n O\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Radiographic findings:\n - generalized horizontal bone loss\n - generalized moderate interproximal calculus\n - adverse crown to root ratio:\n - evidence of furcation:\n - widened PDL:\n\n A\n\n Periodontal diagnosis:\n - AAP:\n - ADA:\n\n Prognosis:\n - fair:\n - questionable:\n - hopeless:\n\n P\n\n - Took diagnostic impressions, facebow, & bite registration.\n - treatment plan: SRP 4 quads, then 4-6 week re-eval\n\n - NV: restorative COE"
},
{
"id": "c017.0",
"section": "EXAMS",
"title": "RESTORATIVE COE (2) — restorative COE: equipment",
"body": "restorative COE: equipment\n    ●​ from sterilization: exam kit, cheek retractors + intraoral mirrors, digital camera, facebow, Regisil gun, patient goggles, blood\n         glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, alginate mixing bowl, spatula\n    ●​ in clinic: alginate, water cylinder, impression trays, alginate spray adhesive, Regisil + tip"
},
{
"id": "c017.1",
"section": "EXAMS",
"title": "RESTORATIVE COE (2) — restorative COE: steps",
"body": "restorative COE: steps\n    1.​ seat patient\n             ○​ get the patient from the waiting room & seat them in the assistant chair next to you\n             ○​ explain to the patient what will happen at today’s appointment\n    2.​ update forms (4): med hx + medications/allergies + dental history + caries risk\n             ○​ review/refresh (Ctrl + R) medical history, medications, & allergies — ensure date is updated for both (2 dates)\n             ○​ complete the “Dental History” tab in patient EPR\n             ○​ plan & complete code D0604 (Caries Risk Documentation)\n                      ■​ follow the pop-up prompts to add the caries risk form\n                      ■​ the form will calculate the patient’s caries risk → plan & complete the appropriate caries risk code\n                            (D060X) indicated by the form (low, medium, high)\n    3.​ take blood pressure\n             ○​ move the patient to the dental chair & take blood pressure & pulse (blood glucose if indicated) — enter into Axium\n    4.​ check in\n             ○​ present the patient’s name, age, gender, vital signs, medical history, medications, allergies, procedure for today\n    5.​ EOE & IOE\n             ○​ complete the EOE & IOE, filling out the 3rd tab in patient EPR, “Clinical Exam”\n    6.​ enter findings into odontogram\n             ○​ go tooth by tooth & note your findings (enter straight into odontogram or write them down)\n             ○​ while in the “Tx History” tab, click the plus sign on the right to open the “Chart Add” tab\n             ○​ you can search, or you can click the “Full List” tab to see a list of your options\n             ○​ under “Findings,” you can chart: tooth position, tooth orientation, caries, fractured\n                  tooth, fractured restoration, decalcification, soft tissue condition, periapical pathosis,\n                  open contact, open margin, overhanging margin, abfraction/abrasion\n             ○​ under “Dental Txs,” you can chart any existing dental fillings/crowns/RCTs/etc.; make\n                  sure you click the magnifying glass (“Add Finding”) — do not             click P (“Plan”)\n             ○​ add a finding by clicking the magnifying glass (“Add Finding”) ​\n\n    7.​ check in\n             ○​ present your findings to instructor, present any teeth you think will need endo testing, determine if patient will\n                   need implant consult\n    8.​ implant consult\n             ○​ if the patient is considering implants: for the next appointment (treatment plan presentation) any patient who will\n                   be treatment planned for implants requires an implant consult before the treatment planning appointment — do it\n                   today! — implant faculty are usually understanding if pt is there & will not require mounted casts / waxup\n    9.​ perform endo testing\n    10.​ take intraoral photos\n             ○​ see Adding Intraoral Photos & Outside Radiographs\n    11.​ complete codes & note\n             ○​ D0150B (Additional Assessments)\n                        ■​ if the restorative COE is your first visit (no perio COE yet), complete code D0150A (Initial Assessments)\n                           instead of D0150B\n             ○​ D0475 (Diagnostic Casts -- N/C)\n             ○​ D0350 (2D Oral/facial photo image)\n             ○​ D0604 (Caries Risk Documentation)\n             ○​ D060X (Caries Risk Assessment & Documentation, finding of low/moderate/high)\n             ○​ D0460 (Pulp Vitality Tests)\n    12.​ check in\n             ○​ have faculty swipe EPR, codes, notes\n             ○​ have them swipe now so that you can go straight to the lab to pour impressions\n    13.​ take mounting records\n\n              ○​ if you didn’t take mounting records at the last appointment (perio COE), do it now\n              ○​ take a facebow on any patient whose casts you will mount (phase 2 or phase 3 treatment)\n                       ■​ a facebow record allows you to mount the maxillary cast\n              ○​ take a bite registration for any casts you will not be able to hand articulate\n                       ■​ a bite registration allows you to mount the mandibular cast against the maxillary in cases where hand\n                           articulation is not possible\n                       ■​ if the patient does not have any posterior teeth in occlusion, you will need to make wax rims in the lab &\n                           bring the patient back for another appointment to take bite registration on the wax rims in order to\n                           mount the casts\n     14.​ take impressions\n              ○​ if you didn’t take impressions at the last appointment (perio COE), do it now\n              ○​ if the patient requires phase 2 or phase 3 treatment, take diagnostic impressions — take impressions at very end of\n                  appointment, you need to pour them within 15 minutes of taking them"
},
{
"id": "c017.2",
"section": "EXAMS",
"title": "RESTORATIVE COE (2) — restorative COE: note template",
"body": "restorative COE: note template\n S\n\n - y/o female patient presents to Vivaldi clinic for Restorative COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: last time at dentist: ; brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n O\n\n Completed extraoral exam & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n Updated odontogram with radiographic & clinical hard tissue findings:\n -\n\n - occlusal assessment:\n - endo testing:\n\n A\n - TMJ conditions:\n - soft tissue conditions:\n - hard tissue conditions:\n - caries risk: high risk (see caries risk form)\n - pulpal diagnosis:\n - occlusal conditions:\n - esthetic considerations:\n\n P\n - Took diagnostic impressions, facebow, & bite registration.\n - Took intraoral photos.\n\n - NV: treatment plan"
},
{
"id": "c018.0",
"section": "EXAMS",
"title": "TREATMENT PLAN (3) — treatment plan: equipment",
"body": "treatment plan: equipment\n    ●​ from sterilization: exam kit, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, mounted diagnostic casts\n    ●​ in clinic: signature pad"
},
{
"id": "c018.1",
"section": "EXAMS",
"title": "TREATMENT PLAN (3) — treatment plan: steps",
"body": "treatment plan: steps\n\n↳ before the appointment\n    1.​ if your patient will require phase 2 or phase 3 treatment, you need diagnostic casts mounted & completed wax-ups\n              ○​ if planning an RPD, you must: (a) survey casts, (b) design the RPD (drawn on RPD Planning Worksheet)\n    2.​ completely finish your treatment plan for the patient — do this on your own time outside of clinic\n              ○​ create a treatment plan by using the “Treatment Plan” tab\n                       ■​ do not add anything under the “Problems” box (top left) of the treatment plan — any “problems” added\n                            will require a swipe by an instructor / will lock you out if not swiped in 2 weeks\n              ○​ an unapproved treatment plan appears in blue\n              ○​ special circumstances for implants:\n                       ■​ if you are treatment planning for an implant, you need an implant consult before your instructor an\n                            approve your treatment plan (!)\n                                  ●​ some instructors will be okay with you including an Implant Consult code (D9360 for UG Implant\n                                     Consult Overdenture, D9365 for UG Implant Consult STI) if you are unable to get an implant\n                                     consult before tx plan\n                       ■​ if the site is already edentulous (tooth is already extracted), you will need to complete a diagnostic wax-up\n                       ■​ see Implant Consult\n    3.​ before the patient’s appointment (ideally at least the day before), find your instructor at a time when they’re free (between\n         patients or at lunch) & discuss the treatment plan with them; have the instructor swipe the treatment plan\n              ○​ an instructor-approved (swiped) treatment plan appears green\n\n↳ at the appointment\n     1.​ seat patient\n             ○​ get the patient from the waiting room & seat them in the assistant chair next to you\n             ○​ explain to the patient what will happen at today’s appointment\n             ○​ if other treatment will be performed today\n                      ■​ review/refresh (Ctrl + R) Medical History, medications, & allergies — ensure date is updated\n                      ■​ take patient’s blood pressure & pulse (blood glucose if indicated) — enter into Axium\n                      ■​ you can skip this step if today’s appointment will only be for treatment plan presentation\n     2.​ check in\n             ○​ present the patient’s name, age, gender, (vital signs, medical history, medications, allergies), procedure for today\n     3.​ present treatment plan\n             ○​ present the treatment plan to the patient\n             ○​ diagrams to show pts\n             ○​ have the patient sign the treatment plan\n                      ■​ plug a signature pad into the computer\n                      ■​ to allow the patient to sign, click “Pt. Accept/Print”\n                      ■​ close out of the tx plan PDF that pops up (you will print later)\n                      ■​ wait for the white box to pop up → have patient sign\n                      ■​ after pt signs, a popup will ask you if you want to print → click yes\n             ○​ give pt a printed copy & go over it with them\n             ○​ a treatment plan approved by the patient changes from green to black (approved)\n     4.​ complete codes & note\n             ○​ D0150C (Tx Plan Developed)\n     5.​ check in\n             ○​ have instructor swipe EPR/codes/notes"
},
{
"id": "c018.2",
"section": "EXAMS",
"title": "TREATMENT PLAN (3) — treatment plan: note template",
"body": "treatment plan: note template\n   y/o female patient presents to Vivaldi clinic for treatment plan presentation.\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n All treatment options, costs, & timelines were thoroughly reviewed with the patient. Discussed advantages & disadvantages of treatments. Pt’s\n questions were answered & pt understood treatment options. Pt opts for optimal treatment plan. Verbal and written consent obtained.\n\n Specific treatments discussed:\n — Pt understands crown on #18 needs to be removed & caries needs to be evaluated/excavated before tooth can be deemed restorable. Pt\n understands that if tooth is nonrestorable, extraction & implant or adding tooth to RPD are tx options.\n — Pt understands caries on #8 approximates pulp, and that pulp may be exposed during excavation. Pt understands tooth may need RCT + crown.\n —\n\n NV:"
},
{
"id": "c019.0",
"section": "EXAMS",
"title": "IMPLANT CONSULT — implant consult: equipment",
"body": "implant consult: equipment\n    ●​ from sterilization: exam kit, patient goggles\n    ●​ from locker: mounted diagnostic cast with wax up"
},
{
"id": "c019.1",
"section": "EXAMS",
"title": "IMPLANT CONSULT — implant consult: steps",
"body": "implant consult: steps\n    1.​ casts & wax-up\n              ○​ before the appointment, you should have diagnostic casts mounted with a wax-up completed\n              ○​ if the tooth is still there but will be extracted later, you don’t have to do a wax-up\n              ○​ sometimes implant staff will be nice & will allow you to get the consult before you have casts/wax up if you’re\n                   bringing the patient for an implant consult same-day as the COE\n    2.​ book a chair\n              ○​ book the patient in the implant consult chair in Chicago clinic; it’s easier to ask Chicago front desk to book it for\n                   you (booking it yourself in Axium is weird/difficult) — the consult will take ~15-30 minutes\n              ○​ the implant clinic also takes consult walk-ins, so if you need a same-day consult just go check in with the Chicago\n                   front desk\n    3.​ find the “STI Diagnostic Checklist” document\n              ○​ you can get one from the bay area between Chicago & Vivaldi — in black document trays on the desk next to the 2\n                   computers\n              ○​ also available to print from Blackboard PIP site or available here\n              ○​ complete the STI Diagnostic Checklist as best you can before you call the instructor over\n    4.​ seat patient\n              ○​ get the patient from the waiting room & seat them in the dental chair\n              ○​ explain to the patient what will happen at today’s appointment\n    5.​ check in\n              ○​ have the implant instructor come over → review checklist with instructor & have them sign the checklist sheet\n              ○​ make sure every line has a check for either “Yes” or “No” — if you missed something, ask the instructor to clarify\n    6.​ add codes to tx plan\n              ○​ if patient is approved for implant, ask the instructor which codes you will need to add to your treatment plan under\n                   the Treatment Plan tab (do not complete them)\n              ○​ there is a list of codes on the back of the STI Diagnostic Checklist sheet\n              ○​ if patient is not approved for UG implant, refer to PG Prosth for implant consult with them (complete Axium\n                   referral)\n    7.​ complete codes & note\n              ○​ D9365 (UG Implant Consultation - Single Tooth)\n    8.​ check in\n              ○​ have instructor swipe EPR/codes/notes\n    9.​ dismiss patient\n    10.​ get tx plan approved\n              ○​ have your restorative instructor (not implant instructor) approve your new treatment plan that includes the STI\n                   codes"
},
{
"id": "c019.2",
"section": "EXAMS",
"title": "IMPLANT CONSULT — implant consult: note template",
"body": "implant consult: note template\n  y/o female patient presents to Chicago clinic for #4 STI consultation.\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Patient was evaluated for UG STI placement #4. Patient is provisionally accepted for UG STI placement pending CBCT results.\n\n NV:\n\nimplant codes\n D9365          UG Implant Consultation — STI\n\n D0365L         CBCT — One arch, mandible\n\n D0366U         CBCT — One arch, maxilla\n\n D6190          Implant surgical guide\n\n D7140          Extraction\n\n D7953UG        Extraction site preservation / graft\n\n D6010U2        UG surg. place. endosteal implant\n\n D6104UG        Bone graft at impl. place\n\n D7952UG        Sinus lift — internal\n\n D4266UG        Guided tissue regeneration (GTR)\n\n D6051          Interim abutment (provisional)\n\n DD6057         Digital-custom abutment\n\n D6059          PFM crown, on abutment (cement retained)\n\n DD6058         Digital — All porcelain/ceramic crown on abutment (cement retained)\n\n D6062          Cast high noble metal crown, on abutment (cement retained)\n\n D6066          PFM crown, directly on implant (screw-retained)\n\n D6065          All ceramic crown directly on implant (screw-retained)\n\n D6067          Cast high noble metal crown, directly on implant (screw-retained)\n\n D6199          Unspecified implant procedure (gold crown)\n\n D9930          Tx Complications — unusual circumstance"
},
{
"id": "c020.0",
"section": "EXAMS",
"title": "POE — ●​ POE = periodic oral examination",
"body": "●​ POE = periodic oral examination\n      ●​ a POE is completed on all existing (not brand-new) patients at UIC COD\n      ●​ what will you do at a POE? what chair will you book for a POE?\n             ○​ if the patient is a perio maintenance patient:\n                      ■​ perio maintenance and POE both take a while & should be scheduled for separate appointments until you\n                            feel comfortable with the patient & how long their typical appointments will take\n                      ■​ the perio chart (probing depths, etc.) is updated at every perio maintenance appointment (perio chair)\n                      ■​ because probing depths are updated at perio maintenance appointments, a POE for a perio maintenance\n                            patient is usually in a restorative chair\n                      ■​ what you’ll do at a POE for a perio maintenance patient:\n                                  ●​ update the EPR — review/refresh “Medical History” tab, medications & allergies\n                                  ●​ EOE & IOE — “Clinical Exam” tab\n                                  ●​ update the odontogram\n                                  ●​ take radiographs (BWs every year, FMX every 3 years)\n                                  ●​ create a treatment plan based on findings, if needed; get instructor & patient approval\n                      ■​ later, once you’re faster & feel comfortable, you can schedule perio maintenance & POE in 1 appointment\n                                  ●​ you will schedule the patient in a perio chair, complete the perio maintenance (which includes\n                                       updating probing depths), & get the perio maintenance checked by the perio instructor\n                                  ●​ then, you will find a restorative instructor who has some free time, ask them if they’ll do the\n                                       patient’s POE with you, then complete the POE\n             ○​ if the patient is a prophy patient:\n                      ■​ prophy & POE take short enough that they can be regularly scheduled at the same appointment; for your\n                            first few, you might want to schedule them separately so you know how long you’ll take; otherwise try for\n                            one 3-hour appointment until you know you’ll only need 2 hours\n                      ■​ the perio chart (probing depths, etc.) is updated once per year for prophy patients; this means that every\n                            other prophy+POE appointment will require you to update the perio chart\n                      ■​ so, half of prophy+POE appointments will be in a restorative chair — for patients whose perio chart\n                            (probing depths, etc.) have been updated within the past year\n                      ■​ the other half of prophy+POE appointments will be in a perio chair — for patients whose perio chart\n                            (probing depths, etc.) have not been updated within the past year\n                      ■​ what you’ll do at a POE for a prophy patient:\n                                  ●​ update the EPR — review/refresh “Medical History” tab, medications & allergies\n                                  ●​ EOE & IOE — “Clinical Exam” tab\n                                  ●​ update the odontogram\n                                  ●​ if perio chart (probing depths, etc.) are more than 1 year old → update perio chart & perio EPR\n                                       (you’ll need to be in a perio chair for this)\n                                  ●​ if perio chart (probing depths, etc.) are less than 1 year old → no need to update (you’l be in a\n                                       restorative chair for this)\n                                  ●​ take radiographs (BWs every year, FMX every 3 years)\n                                  ●​ create a treatment plan based on findings, if needed; get instructor & patient approval\n                                  ●​ prophy\n      ●​ summary:\n             ○​ prophy only, probing depths do need to be updated (most recent probing depths are more than 1 year ago) →\n                  perio chair\n             ○​ prophy only, probing depths do not need to be updated (most recent probing depths are within the past year) →\n                  restorative chair\n             ○​ prophy + POE, probing depths need to be updated (most recent probing depths are more than 1 year ago) → perio\n                  chair for prophy, then call restorative instructor over to perio chair for POE\n             ○​ prophy + POE, probing depths do not need to be updated (most recent probing depths are within the past year) →\n                  restorative chair for prophy + POE\n             ○​ perio maintenance only (probing depths are always updated at perio maintenance) → perio chair\n             ○​ perio maintenance + POE (probing depths are always updated at perio maintenance) → perio chair for perio\n                  maintenance, then call restorative instructor over to perio chair for POE\n\nprophy\n    ●​ D1110 (prophy)\n    ●​ for patients without periodontal disease = without bone loss = pts who have gingivitis only\n    ●​ part of phase I or phase IV\n            ○​ phase I — if you see a new patient (COE) & they have not had prophy within past 6 months at another office, you’ll\n                do a prophy as part of phase I (one of the first appointments you’ll have with them)\n            ○​ phase IV — prophy every 6 months (usually) as part of phase IV recall treatment\n    ●​ most commonly every 6 months\n    ●​ a prophy is usually performed at the same appointment as a POE (D0120), which is also performed every 6 months\n    ●​ prophy patients need their perio chart & perio EPR updated once per year\n            ○​ this means that at every other prophy+POE appointment, you will need to update the perio chart & perio EPR"
},
{
"id": "c021",
"section": "EXAMS",
"title": "SRP",
"body": "●​ D4243 (Sc/Rp 1-3 teeth/quad) — or — D4341 (Sc/Rp 4 or more teeth/quad)\n      ●​ part of phase I\n      ●​ for patients with periodontal disease = with bone loss\n      ●​ the initial cleaning for a patient with periodontitis & pockets greater than 5 mm\n      ●​ at this appointment, the perio chart does not need to be updated (it was just recently updated at the perio COE)\n      ●​ this appointment consists of a straight-forward deep cleaning\n              ○​ usually, 2 quads are done at once (top+bottom right side, or top+bottom left side) to be most efficient\n              ○​ for pts with lots of plaque/calculus, it might take so long that only 1 quad can be done at an appointment\n      ●​ some patients may need a combination of prophy & SRP\n              ○​ ex: probing depths in upper right and lower left are greater than 5 mm, but probing depths in upper left & lower\n                   right are less than 5 mm → this pt would need SRP UR, LL (planned for 2 D4241 codes) and remainder of the\n                   mouth (UL, LR) would need prophy (planned for 1 prophy code to cover the remainder of the mouth)\n\nperio reevaluation\n    ●​ D0170 (re-eval limited)\n    ●​ part of phase I\n    ●​ for patients with periodontal disease = with bone loss\n    ●​ the purpose of this appointment is to determine the success of previous periodontal treatment (SRP); it is scheduled 4-6\n         weeks after the last quadrant of SRP\n             ○​ do not clean the teeth at a perio reeval appointment! just evaluate\n    ●​ at this appointment, the perio chart is updated; the student dentist decides whether more periodontal therapy (referral to\n         PG perio) is required or if patient can be placed into periodontal maintenance (student dentist decides interval)\n\nperio maintenance\n    ●​ D4910 (perio maintenance)\n    ●​ part of phase IV\n    ●​ only for patients with controlled periodontal disease (SRP has been completed, reeval appointment has been completed,\n        patient’s disease is considered controlled)\n    ●​ a perio maintenance appointment is essentially a prophy for a patient who was originally diagnosed with periodontitis,\n        completed SRP, and whose disease is now under control (all probing depths <5 mm)\n    ●​ perio maintenance is performed every 3-4 months\n    ●​ perio maintenance patients need their perio chart updated every appointment\n    ●​ perio maintenance will sometimes coincide with a POE (D0120), which is performed every 6 months\n    ●​ depending on the patient, POE & perio maintenance may both take too long to schedule at the same appointment"
},
{
"id": "c022.0",
"section": "EXAMS",
"title": "POE — POE: equipment",
"body": "POE: equipment\n   ●​ from sterilization: exam kit, radiograph kit, patient goggles, blood glucose kit\n            ○​ if prophy pt: prophy handpiece, perio kit, implant maintenance kit, Cavitron insert, toothbrush\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection, dentech & toothbrush for OHI\n   ●​ in clinic (if prophy patient): ziploc, toothpaste for pt\n   ●​ in unit (if prophy patient): prophy angle, prophy paste"
},
{
"id": "c022.1",
"section": "EXAMS",
"title": "POE — POE: steps",
"body": "POE: steps\n   1.​ get a start check\n            ○​ if you want to take radiographs on the pt, get that OK'd by the instructor now\n   2.​ complete caries risk assessment\n            ○​ plan & complete code D0604 (Caries Risk Documentation)\n                     ■​ follow the pop-up prompts to add the caries risk form\n                     ■​ the form will calculate the patient’s caries risk → plan & complete the appropriate caries risk code\n                          (D060X) indicated by the form (low, medium, high)\n            ○​ if the patient is a smoker, complete 2 tobacco codes:\n                     ■​ D1320.1 (Record Tobacco Usage) — follow the pop-up prompts to add the tobacco form\n                     ■​ D1320.2 (Provide Tobacco Cessation Education)\n                     ■​ at next apt you can complete 3rd code, D1320.3 (Tobacco Cessation Follow Up with Patient)\n   3.​ take bitewings\n            ○​ take bitewings if patient is due (1x/year)\n   4.​ complete EOE & IOE\n            ○​ fill out the “Clinical Exam” tab\n   5.​ update the odontogram\n   6.​ create treatment plan\n            ○​ if you find new problems, create a new treatment plan to address these findings\n            ○​ create the new treatment plan in the “Tx Plans” tab\n   7.​ check in\n            ○​ present your intraoral findings, radiographic findings, & newly developed treatment plan\n            ○​ if new treatment plan is developed, have instructor swipe to approve then obtain patient approval/signature\n   8.​ for prophy patients\n            ○​ complete prophy\n            ○​ if perio chart/EPR is older than 1 year old, update perio chart & perio EPR (“Periodontal Exam” tab only)\n                     ■​ a prophy is every 6 months & a POE is every 6 months → this means that every 6 months the patient\n                          should get a prophy + POE together\n                     ■​ a prophy patient needs their perio EPR & perio chart updated 1x per year → this means that every other\n                          (1x per year) prophy+POE appointment requires updated perio charting\n            ○​ review OHI, nutritional counseling, tobacco cessation\n            ○​ check in — have instructor check prophy\n   9.​ complete codes & note\n            ○​ D0120 (Periodic oral evaluation)\n            ○​ D0604 (Caries Risk Documentation)\n            ○​ D060X (Caries Risk Assessment & Documentation, finding of low/moderate/high)\n            ○​ D1320.1 (Record Tobacco Usage)\n            ○​ D1320.2 (Provide Tobacco Cessation Education)\n            ○​ D0274 (Bitewing - 4 films)\n            ○​ D1110 (Prophy - adult)\n            ○​ D1330 (Oral hygiene instructions)\n            ○​ D1310 (Nutritional counseling)\n   10.​ check in\n            ○​ review what happened today & have instructor swipe EPR/codes/notes"
},
{
"id": "c022.2",
"section": "EXAMS",
"title": "POE — POE: note template",
"body": "POE: note template\n - y/o female patient presents to Vivaldi clinic for POE\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n - dental history: brushing 2x a day & flossing 1x a day\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n POE:\n\n Completed extraoral & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n - caries risk: high (see completed caries risk form)\n\n Took 4 bitewings; updated odontogram with radiographic & clinical hard tissue findings:\n -\n - endo testing:\n\n Prophy:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed supragingival & subgingival plaque & calculus using Cavitron (with an assistant using HVE) & hand instruments. Flossed. Polished with\n prophy paste. Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation.\n\n Treatment planned for the following treatments:\n -\n Thoroughly reviewed all treatment options, costs, & timelines with pt. Discussed advantages & disadvantages of treatments. Answered pt’s\n questions. Pt understood treatment options. Obtained verbal and written consent for tx plan.\n\n - NV:"
},
{
"id": "c023",
"section": "PERIO",
"title": "PROPHY",
"body": "prophy: equipment\n    ●​ from sterilization: perio kit, implant kit, Cavitron insert, prophy handpiece, toothbrush, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, dentech & toothbrush for OHI\n    ●​ in clinic: ziploc, toothpaste & floss for pt\n    ●​ in unit: prophy angle, prophy paste\n\nprophy: steps\n    1.​ get a start check\n    2.​ complete perio chart\n             ○​ if perio chart/EPR is older than 1 year old, update perio chart & perio EPR\n                      ■​ a prophy is every 6 months & a POE is every 6 months → this means that every 6 months the patient\n                           should get a prophy + POE together\n                      ■​ a prophy patient needs their perio EPR & perio chart updated 1x per year → this means that every other\n                           (1x per year) prophy+POE appointment requires updated perio charting\n             ○​ create a new perio chart (Perio Chart → plus sign at top → select “Prophy Recall Evaluation” next to “Exam Type”)\n             ○​ complete the perio chart\n                      ■​ probing depths\n                      ■​ bleeding on probing\n                      ■​ free gingival margin\n                      ■​ mucogingival deformities/defects\n                      ■​ mobility\n                      ■​ furcation involvement\n    3.​ complete perio EPR\n             ○​ under the EHR “Forms” tab, open the “Periodontic EPR” form & update only the first tab, “Periodontal Exam”\n    4.​ check in — see if instructor wants to check your findings before you complete prophy\n    5.​ complete prophy\n             ○​ use Cavitron first\n                      ■​ if pt has gross plaque buildup, use prophy cup first\n             ○​ floss to remove gross plaque from interproximals\n             ○​ finish up with hand instruments — don’t forget interproximals\n             ○​ before you call the instructor over to check, make sure you check your work with the 11/12 ODU explorer,\n                  especially in 3 spots: line angles, CEJ, & under the contact\n             ○​ polish after instructor has checked prophy so that there isn’t prophy paste debris\n    6.​ check in — have your instructor check your prophy (and perio EPR/chart if they haven’t done so)\n    7.​ polish\n             ○​ polish after instructor has checked prophy so that there isn’t prophy paste debris\n    8.​ OHI, nutritional counseling, tobacco cessation\n    9.​ complete codes & note\n             ○​ D1110 (Prophy - adult)\n             ○​ D1330 (Oral hygiene instructions)\n             ○​ D1310 (Nutritional counseling)\n             ○​ D1320.1 (Record Tobacco Usage)\n             ○​ D1320.2 (Provide Tobacco Cessation Education)\n    10.​ check in — have instructor swipe EPR/codes/notes\n\nprophy: note template\n - y/o female patient presents to Vivaldi clinic for prophy\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Prophy:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed plaque & calculus using Cavitron (with assistant using HVE) & hand instruments. Flossed. Polished with prophy paste.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation. Emphasized that patient needs to .\n\n - NV:"
},
{
"id": "c024",
"section": "PERIO",
"title": "SRP",
"body": "SRP: equipment\n    ●​ from sterilization: perio kit, implant kit, Cavitron insert, toothbrush, septocaine, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, dentech & toothbrush for OHI\n    ●​ in clinic: ziploc, toothpaste & floss for pt\n    ●​ in unit: anesthetic needle/carpule/shield/topical, floss\n\nSRP: steps\n    1.​ get a start check\n    2.​ deliver local anesthetic\n             ○​ for mandibular:\n                       ■​ if 3+ teeth require SRP, give IAN (check with instructor)\n                       ■​ if only 1-2 teeth require SRP, you can give buccal infiltrations instead of IAN (check with instructor)\n                       ■​ mental nerve block is super useful for SRP, especially with septocaine\n             ○​ for maxillary:\n                       ■​ give appropriate buccal & palatal infiltrations (check with instructor)\n                       ■​ if all maxillary teeth will need SRP, aim for PSA + MSA + ASA blocks and greater palatine block\n    3.​ SRP\n             ○​ look at bitewings & perio probings for reference\n             ○​ use Cavitron first\n                       ■​ if pt has gross plaque buildup, use prophy cup first\n             ○​ floss to remove gross plaque from interproximals\n             ○​ finish up with hand instruments — don’t forget interproximals\n             ○​ before you call the instructor over to check, make sure you check your work with the 11/12 ODU explorer,\n                  especially in 3 spots: line angles, CEJ, & under the contact\n    4.​ OHI, nutritional counseling, tobacco cessation\n    5.​ give post-op instructions\n             ○​ don’t eat until anesthetic has worn off\n             ○​ pt’s gums may be sore\n             ○​ pt may bleed for the next 30-60 min, and may bleed more than normal for the next 2-3 days, but will then heal\n             ○​ teeth may be sensitive due to calculus removal\n             ○​ if pt has sore gums or tooth sensitivity, they may take ibuprofen 400 mg every 6 hr (or acetaminophen 1000 mg\n                  every 8 hr)\n    6.​ complete codes & note\n             ○​ D4243 (Sc/Rp 1-3 teeth/quad) — or — D4341 (Sc/Rp 4 or more teeth/quad)\n             ○​ D1330 (Oral hygiene instructions)\n             ○​ D1310 (Nutritional counseling)\n             ○​ D1320.1 (Record Tobacco Usage)\n             ○​ D1320.2 (Provide Tobacco Cessation Education)\n    7.​ check in — have instructor check your work & swipe your EPR/codes/notes\n\nSRP: note template\n - y/o female patient presents to Vivaldi clinic for SRP of UR.\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n SRP UR:\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltrations of UR quadrant & greater palatine block on R.\n\n Completed SRP using Cavitron (with an assistant using HVE) & hand instruments to remove supragingival and subgingival plaque & calculus.\n Flossed.\n\n Gave pt post-op instructions re: numbness, sore gums, tooth sensitivity, bleeding, ibuprofen/acetaminophen regimen.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation. Emphasized that patient needs to .\n\n - NV:"
},
{
"id": "c025",
"section": "PERIO",
"title": "PERIO RE-EVAL — perio re-eval: steps",
"body": "perio re-eval: equipment\n    ●​ from sterilization: exam kit, prophy handpiece, toothbrush, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: ziploc, toothpaste & floss for pt\n    ●​ in unit: prophy angle, prophy paste, disclosing tablet/solution\nperio re-eval: steps\n    1.​ get a start check\n    2.​ complete perio chart\n              ○​ do not plaque disclose immediately\n              ○​ create a new perio chart (Perio Chart → plus sign at top → select “Perio Re-Eval” next to “Exam Type”)\n              ○​ complete the perio chart\n                      ■​ probing depths\n                      ■​ bleeding on probing\n                      ■​ free gingival margin\n                      ■​ mucogingival deformities/defects\n                      ■​ mobility\n                      ■​ furcation involvement\n    3.​ complete perio EPR\n              ○​ under the EHR “Forms” tab, open the “Periodontic EPR” form & update 2 tabs of the perio EPR: “Periodontal Exam”\n                  & “Re-evaluation” — don’t forget to fill out the “Re-evaluation” tab on the perio EPR (!!!)\n    4.​ make perio tx plan\n              ○​ if patient’s periodontal health has improved, you can place the patient into perio recall (perio maintenance) &\n                  determine/adjust perio interval under “Treatment Plan” in perio EPR\n              ○​ if patient’s periodontal health has not improved, referral to PG perio is indicated (or potentially you re-SRP)\n    5.​ check in — present to instructor: findings, treatment plan / referral to PG perio\n    6.​ plaque disclosure — must complete!\n              ○​ have patient use disclosing tablet/solution\n              ○​ enter surfaces with plaque into perio chart\n              ○​ clicking the clipboard icon to access the auto-calculated O’Leary plaque\n                  index\n    7.​ OHI, nutritional counseling, tobacco cessation\n              ○​ must complete!\n              ○​ use dentech to demonstrate proper brushing & flossing technique\n              ○​ have patient demonstrate what they’ve learned using hand-held mirror; critique their technique\n    8.​ complete codes & note\n              ○​ D0170 (Re-Eval. - limited, prob. focus)\n              ○​ D1330 (Oral hygiene instructions)\n              ○​ D1310 (Nutritional counseling)\n              ○​ D1320.1 (Record Tobacco Usage)\n              ○​ D1320.2 (Provide Tobacco Cessation Education)\n    9.​ check in — have instructor swipe EPR/codes/note\n\nperio re-eval: note template\n - y/o female patient presents to Vivaldi clinic for perio re-evaluation after SRP 4 quads completed 1/1/2000\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Perio re-eval:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - O’Leary plaque index:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n\n Patient’s periodontal health has improved — . Upon evaluation, patient will be placed on perio maintenance interval of 4 months.\n\n - NV:"
},
{
"id": "c026",
"section": "PERIO",
"title": "PERIO MAINTENANCE — perio maintenance: steps",
"body": "perio maintenance: equipment\n    ●​ from sterilization: perio kit, implant kit, Cavitron insert, prophy handpiece, toothbrush, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, dentech & toothbrush for OHI\n    ●​ in clinic: ziploc, toothpaste & floss for pt\n    ●​ in unit: prophy angle, prophy paste, floss\n\nperio maintenance: steps\n    1.​ get a start check\n    2.​ complete perio chart\n             ○​ you need to update the perio chart & perio EPR at every perio maintenance appointment\n             ○​ create a new perio chart (Perio Chart → plus sign at top → select “Perio Maintenance” next to “Exam Type”)\n             ○​ complete the perio chart\n                      ■​ probing depths + bleeding on probing\n                      ■​ free gingival margin\n                      ■​ mobility\n                      ■​ furcation involvement\n                      ■​ mucogingival defects\n    3.​ complete perio EPR\n             ○​ under the EHR “Forms” tab, open the “Periodontic EPR” form & update only the first tab, “Periodontal Exam”\n             ○​ adjust perio maintenance interval as indicated (“Treatment Plan” tab)\n    4.​ check in — have instructor check perio chart & EPR (instructor may have you do plaque disclosure)\n    5.​ cleaning\n             ○​ perio maintenance is basically a prophy (may have localized SRP in areas with deeper pockets; you can get the\n                  patient numb in these areas if they need it, usually they will not with regular perio maintenance)\n             ○​ use Cavitron first\n                      ■​ if pt has gross plaque buildup, use prophy cup first\n             ○​ floss to remove gross plaque from interproximals\n             ○​ finish up with hand instruments — don’t forget interproximals\n             ○​ before you call the instructor over to check, make sure you check your work with the 11/12 ODU explorer,\n                  especially in 3 spots: line angles, CEJ, & under the contact\n             ○​ polish after instructor has checked prophy so that there isn’t prophy paste debris\n    6.​ check in — have your instructor check cleaning\n    7.​ polish\n             ○​ polish after instructor has checked prophy so that there isn’t prophy paste debris\n    8.​ OHI, nutritional counseling, tobacco cessation\n    9.​ complete codes & note\n             ○​ D4910 (Periodontal maintenance)\n             ○​ D1330 (Oral hygiene instructions)\n             ○​ D1310 (Nutritional counseling)\n             ○​ D1320.1 (Record Tobacco Usage)\n             ○​ D1320.2 (Provide Tobacco Cessation Education)\n    10.​ check in — have instructor swipe EPR/codes/notes\n\nperio maintenance: note template\n - y/o female patient presents to Vivaldi clinic for perio maintenance\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Perio maintenance:\n\n Updated perio EPR & perio chart:\n - probing depths:\n - bleeding on probing:\n - recession:\n - furcation:\n - mobility:\n - mucogingival defects:\n - [color], [contour], [consistency] gingiva\n\n Removed plaque & calculus using Cavitron (with assistant using HVE) & hand instruments. Flossed. Polished with prophy paste.\n\n Patient is brushing 2x per day and flossing 1x per week. Patient technique is average — moderate generalized plaque with heavy plaque on .\n Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation. Emphasized that patient needs to .\n\n - NV:"
},
{
"id": "c027.0",
"section": "RESTORATIVE",
"title": "AMALGAM — amalgam: equipment",
"body": "amalgam: equipment\n   ●​ from sterilization: amalgam kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, Isodry, septocaine,\n       patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: articulating paper, matrix band, wooden wedges, wedget, amalgamator, amalgam capsules, Gluma, rubber dam\n   ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c027.1",
"section": "RESTORATIVE",
"title": "AMALGAM — amalgam: steps",
"body": "amalgam: steps\n   1.​ get a start check\n   2.​ check occlusion\n             ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n             ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ isolate with rubber dam or isodry\n             ○​ don’t forget to tie floss to the clamp\n   5.​ complete prep\n             ○​ pre-wedge (with wooden wedge) for class II (expands PDL & makes restoring a contact easier)\n             ○​ a slow speed bur is more conservative & less powerful than a spoon excavator\n             ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy & clumpy while healthy dentin is\n                 drilled out looking chalky & dusty — this can help you determine if you have removed all decay\n             ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                 drying or scratching with an explorer (composite scratches, tooth does not)\n             ○​ amalgam preps have specific parameters\n                      ■​ convergent buccal & lingual walls\n                      ■​ parallel or slightly divergent proximal walls\n                      ■​ at least 1.5 mm deep; deeper prep if decay extends deeper\n                      ■​ flat pulpal floor with rounded line angles & beveled axiopulpal walls\n                      ■​ does not undermine marginal ridges\n   6.​ check in — have instructor check your prep\n   7.​ place matrix & wedge\n             ○​ place Tofflemire retainer + universal matrix band + wooden wedge, then burnish\n             ○​ the closed end of the Tofflemire retainer goes toward the occlusal surface of the teeth\n             ○​ the matrix band should be narrower gingivally & wider occlusally\n   8.​ clean prep with Consepsis\n             ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   9.​ place liner or base, if indicated\n             ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                          to pulpal floor → light cure 20s → apply Gluma afterward\n             ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                          → cover with Vitrebond (see above) then Gluma\n   10.​ place sealer (Gluma)\n             ○​ sealers (Gluma) are always indicated under amalgam restorations\n             ○​ apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s → lightly dry,\n                 leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be glossy\n                 without pooling)\n   11.​ deliver & condense amalgam\n             ○​ depress amalgam plunger on capsule & amalgamate capsule for 9-12s on medium speed (3600 cpm)\n                      ■​ open capsule & empty amalgam into amalgam well\n                      ■​ evaluate mix — should look consistent, shiny, & smooth (poor mix looks dull, crumbly, or dry)\n             ○​ use the amalgam carrier to deliver amalgam from the amalgam well to the prepared tooth\n                      ■​ overfill the preparation; cavosurface margins should be well covered\n\n             ○​ condense the amalgam\n                       ■​ first, use small condenser with adequate pressure over pulpal wall & into preparation line angles\n                       ■​ next, use large condenser to condense the entire preparation\n                       ■​ use high speed suction to remove excess amalgam\n             ○​ use large ball burnisher to sweep across the restoration to remove excess amalgam; establish the right contour\n                  (fossa and ridges), generally, while continuing to condense the amalgam\n             ○​ use 5T for initial carving, keeping the carving surface on both the tooth and restoration to expose margins\n             ○​ use Cleoid-Discoid, ½ Hollenback, and anatomic burnisher to carve anatomy\n             ○​ smooth the surface with a wet cotton roll once mostly set\n    12.​ check occlusion & contact\n             ○​ remove rubber dam / isodry\n             ○​ check occlusion with articulating paper — be careful! if the patient bites really hard it can fracture the amalgam\n                       ■​ if occlusion is high, adjust with a high-speed bur gently (you don’t want to fracture the amalgam)\n             ○​ check interproximal contact with floss\n    13.​ check in\n             ○​ have instructor check your restoration\n    14.​ complete codes & note\n             ○​ D2140 (Amalgam - 1 surface)\n             ○​ D2150 (Amalgam - 2 surfaces)\n             ○​ D2160 (Amalgam - 3 surfaces)\n             ○​ D2161 (Amalgam - 4 or more surfaces)\n    15.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c027.2",
"section": "RESTORATIVE",
"title": "AMALGAM — amalgam: note template",
"body": "amalgam: note template\n - y/o female patient presents to Vivaldi clinic for #19-MOD amalgam\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as left IAN & long\n buccal block on right / buccal infiltration #19.\n\n #19-MOD amalgam:\n Placed Isodry (size M). Completely removed failing existing MOD composite restoration and excavated decay using high & slow speed burs.\n Prepared cavity preparation to ideal form. Applied Gluma in scrubbing motion for 10s then rinsed thoroughly. Placed Tofflemire band. Delivered,\n overfilled, & condensed amalgam. Removed excess & carved amalgam to ideal anatomic form. Interproximal contact evaluated with floss &\n adjusted to ideal. Occlusion evaluated with articulating paper & adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness,\n sensitivity, sore injection site, uneven bite.\n\n - NV:"
},
{
"id": "c028.0",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS I — composite — class I: equipment",
"body": "composite — class I: equipment\n   ●​ from sterilization: composite kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, composite gun,\n       curing light, Vita shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, microbrushes, articulating paper, wedget, etch, ScotchBond, Gluma, Consepsis, Shofu, Vitrebond +\n       mixing pad, rubber dam\n   ●​ in unit: anesthetic needle/carpule/shield/topical"
},
{
"id": "c028.1",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS I — composite — class I: steps",
"body": "composite — class I: steps\n   1.​ get a start check\n   2.​ check occlusion\n             ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n             ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ select a shade\n   5.​ isolate with rubber dam or isodry\n             ○​ don’t forget to tie floss to the clamp\n   6.​ complete prep\n             ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n             ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                 drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n             ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                 scratching with an explorer (composite scratches, tooth does not)\n   7.​ check in — have instructor check your prep; refine it until they approve\n   8.​ clean prep with Consepsis\n             ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   9.​ place liner or base, if indicated\n             ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n             ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n   10.​ etch & bond\n             ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n             ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                 lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                 glossy without pooling)\n                      ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n             ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n             ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n   11.​ place composite\n             ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n             ○​ cure the final increment for 60s\n   12.​ check occlusion\n             ○​ remove rubber dam / isodry\n             ○​ check occlusion with articulating paper\n   13.​ finish & polish\n             ○​ composite finishing burs, Shofu, Jiffy Brush\n   14.​ check in — have instructor check your restoration\n\n    15.​ complete codes & note\n             ○​ D2391 (Resin-based comp - 1 surf, post.)\n    16.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c028.2",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS I — composite — class I: note template",
"body": "composite — class I: note template\n - y/o female patient presents to Vivaldi clinic for #19-O composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19-O:\n Placed Isodry (size M). Removed existing failing O amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep,\n light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried,\n rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill\n composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy brush.\n Evaluated occlusion with articulating paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore\n injection site, uneven bite.\n\n - NV:"
},
{
"id": "c029.0",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS II — composite — class II: equipment",
"body": "composite — class II: equipment\n   ●​ from sterilization: composite kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, Garrison kit (1-2),\n       composite gun, curing light, Vita shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, microbrushes, articulating paper, matrix bands, wedget, wooden wedges, plastic wedges, etch,\n       ScotchBond, Gluma, Consepsis, Shofu, finishing strips, #12 scalpel, Vitrebond + mixing pad, rubber dam\n   ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c029.1",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS II — composite — class II: steps",
"body": "composite — class II: steps\n   1.​ get a start check\n   2.​ check occlusion\n            ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n            ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ select a shade\n   5.​ isolate with rubber dam or isodry\n            ○​ don’t forget to tie floss to the clamp\n   6.​ pre-wedge\n            ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n            ○​ pre-wedge mesial & distal for MOD\n   7.​ complete prep\n            ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n            ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                 drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n            ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                 drying or scratching with an explorer (composite scratches, tooth does not)\n   8.​ check in — have instructor check your prep; refine it until they approve\n   9.​ place matrix & wedge\n            ○​ place sectional matrix band (smiling toward occlusal) → place plastic wedge → place Garrison ring → burnish\n                      ■​ don’t forget to tie floss to the Garrison ring\n                      ■​ you can use 2 Garrison rings for an MOD — or use one Garrison mesially to restore M contact, switch to\n                           distal to restore D contact, then fill occlusal last\n            ○​ or, place place Tofflemire retainer + universal matrix band + wooden wedge, then burnish\n                      ■​ the closed end of the Tofflemire retainer goes toward the occlusal surface of the teeth\n                      ■​ the matrix band should be narrower gingivally & wider occlusally\n   10.​ clean prep with Consepsis\n            ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   11.​ place liner or base, if indicated\n            ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n            ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n   12.​ etch & bond\n            ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n            ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                 lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                 glossy without pooling)\n                      ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n            ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n            ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n\n    13.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    14.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    15.​ finish & polish\n              ○​ composite finishing burs, Shofu, Cosmedent discs, Jiffy Brush\n    16.​ check in — have instructor check your restoration\n    17.​ complete codes & note\n              ○​ D2392 (Resin-based comp - 2 surf, post.)\n              ○​ D2393 (Resin-based comp - 3 surf, post.)\n    18.​ check in — have instructor swipe your EPR/codes/notes\ncomposite — class II: note template\n - y/o female patient presents to Vivaldi clinic for #19-MOD composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19-MOD:\n Placed Isodry (size M). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. Scrubbed with Consepsis 10s to disinfect, rinsed 5s,\n gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried\n leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s,\n air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with\n finishing diamond burs, polished with Shofu & Jiffy brush. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with\n articulating paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:"
},
{
"id": "c030.0",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS III — composite — class III: equipment",
"body": "composite — class III: equipment\n   ●​ from sterilization: composite kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, composite gun,\n       curing light, Vita shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, microbrushes, articulating paper, clear mylar strip, wedget, wooden wedges, etch, ScotchBond, Gluma,\n       Consepsis, Shofu, finishing strips, #12 scalpel, discs, enamelize, Vitrebond + mixing pad, rubber dam\n   ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c030.1",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS III — composite — class III: steps",
"body": "composite — class III: steps\n   1.​ get a start check\n   2.​ check occlusion\n            ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n            ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ select a shade\n   5.​ isolate with rubber dam or isodry\n            ○​ don’t forget to tie floss to the clamp\n   6.​ pre-wedge\n            ○​ place wooden wedge before prepping to expand PDL; makes restoring a contact easier\n   7.​ complete prep\n            ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n            ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                 drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n            ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                 drying or scratching with an explorer (composite scratches, tooth does not)\n            ○​ prepare from the lingual if possible\n            ○​ the gingival and lingual contacts must be broken; the facial contact is usually broken but does not have to be; when\n                 possible, the incisal contact should not be broken (unless the decay involves the incisal contact)\n            ○​ bevel the margins with a 0.25-0.5 mm bevel at 45°\n            ○​ 2 adjacent lesions: prepare larger lesion → prepare smaller lesion → restore smaller lesion → restore larger lesion\n   8.​ check in — have instructor check your prep; refine it until they approve\n   9.​ place matrix & wedge\n            ○​ place clear mylar strip + wooden wedge\n   10.​ clean prep with Consepsis\n            ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   11.​ place liner or base, if indicated\n            ○​ if placing a liner or base, avoid the facial wall to preserve esthetics\n            ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n            ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n   12.​ etch & bond\n            ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n            ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                 lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                 glossy without pooling)\n                      ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n            ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n            ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n   13.​ place composite\n\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    14.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    15.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush, Cosmedent discs, flexibuff + enamelize\n              ○​ discs: gray > blue > yellow > pink > Flexibuff with Enamelize paste\n    16.​ check in — have instructor check your restoration\n    17.​ complete codes & note\n              ○​ D2330 (Resin-based comp - 1 surf, ant.)\n              ○​ D2331 (Resin-based comp - 2 surf, ant.)\n              ○​ D2332 (Resin-based comp - 3 surf, ant.)\n    18.​ check in — have instructor swipe your EPR/codes/notes\ncomposite — class III: note template\n - y/o female patient presents to Vivaldi clinic for #8-ML composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #8.\n\n #8-ML:\n Placed Isodry (size M). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm\n Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied\n shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished\n with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating\n paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:"
},
{
"id": "c031.0",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS IV — composite — class IV: equipment",
"body": "composite — class IV: equipment\n   ●​ from sterilization: composite kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, composite gun,\n       curing light, Vita shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, microbrushes, articulating paper, clear mylar strip, wedget, wooden wedges, etch, ScotchBond, Gluma,\n       Consepsis, Shofu, finishing strips, #12 scalpel, discs, enamelize, Vitrebond + mixing pad, rubber dam\n   ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c031.1",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS IV — composite — class IV: steps",
"body": "composite — class IV: steps\n   1.​ get a start check\n   2.​ check occlusion\n            ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n            ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ select a shade\n   5.​ isolate with rubber dam or isodry\n            ○​ don’t forget to tie floss to the clamp\n   6.​ pre-wedge\n            ○​ place wooden wedge before prepping to expand PDL; makes restoring a contact easier\n   7.​ complete prep\n            ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n            ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                 drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n            ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                 drying or scratching with an explorer (composite scratches, tooth does not)\n            ○​ create a wide bevel (0.5 to 2.0 mm) to maximize esthetics & retention\n            ○​ 2 adjacent lesions: prepare larger lesion → prepare smaller lesion → restore smaller lesion → restore larger lesion\n            ○​ Link to Dr. Baroudi's Anterior Layering Technique\n   8.​ check in — have instructor check your prep; refine it until they approve\n   9.​ place matrix & wedge\n            ○​ place clear mylar strip + wooden wedge\n   10.​ clean prep with Consepsis\n            ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   11.​ place liner or base, if indicated\n            ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n            ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n   12.​ etch & bond\n            ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n            ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                 lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                 glossy without pooling)\n                      ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n            ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n            ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n   13.​ place composite\n            ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n            ○​ cure the final increment for 60s\n   14.​ check occlusion & contact\n\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    15.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush, Cosmedent discs, flexibuff + enamelize\n              ○​ discs: gray > blue > yellow > pink > Flexibuff with Enamelize paste\n    16.​ check in — have instructor check your restoration\n    17.​ complete codes & note\n              ○​ D2335 (Resin-based comp - 4+ surf, ant.)\n    18.​ check in — have instructor swipe your EPR/codes/notes\ncomposite — class IV: note template\n - y/o female patient presents to Vivaldi clinic for #9-MIFL composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #9.\n\n #9-MIFL:\n Placed Isodry (size M). Removed existing failing MIFL composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Scrubbed with Consepsis 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm\n Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied\n shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished\n with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating\n paper, adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n - NV:"
},
{
"id": "c032.0",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS V — composite — class V: equipment",
"body": "composite — class V: equipment\n   ●​ from sterilization: composite kit, handpieces, restorative burs, composite finishing burs, composite gun, curing light, Vita\n       shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, microbrushes, etch, bond, Consepsis, Gluma, Shofu, cords + Hemodent + dappen dish, Vitrebond +\n       mixing pad\n   ●​ in unit: anesthetic needle/carpule/shield/topical"
},
{
"id": "c032.1",
"section": "RESTORATIVE",
"title": "COMPOSITE — CLASS V — composite — class V: steps",
"body": "composite — class V: steps\n   1.​ get a start check\n   2.​ deliver local anesthetic\n   3.​ select a shade\n   4.​ complete prep\n             ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n             ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                 drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n             ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                 drying or scratching with an explorer (composite scratches, tooth does not)\n             ○​ bevel all enamel margins\n             ○​ if the gingival margin of the prep is in cementum or dentin, create a retentive groove placed gingivally & 2 retentive\n                 coves placed at the incisal point angles\n   5.​ check in — have instructor check your prep; refine it until they approve\n   6.​ clean prep with Consepsis\n             ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n   7.​ place liner or base, if indicated\n             ○​ liner:\n                      ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                      ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n             ○​ base:\n                      ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                      ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n             ○​ Sandwich technique:\n                      ■​ do not etch or bond\n                      ■​ use a microbrush to apply RMGI cavity conditioner to prep for 15s → lightly air dry without water (!) →\n                           light cure 10s\n                      ■​ apply Ketac Nano (RMGI) as bottom layer of “sandwich” — similar to applying a base underneath\n                           composite\n                      ■​ light cure 20s\n                      ■​ then: etch, bond, & place composite like normal\n   8.​ etch & bond\n             ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n             ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                 lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                 glossy without pooling)\n                      ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n             ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n             ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n   9.​ pack a cord\n             ○​ pack a cord if you need to\n             ○​ cords should be sitting in a dappen dish of Hemodent to soak\n   10.​ place composite\n             ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n             ○​ cure the final increment for 60s\n   11.​ finish & polish\n\n             ○​ composite finishing burs, Shofu, Jiffy Brush\n    12.​ check in — have instructor check your restoration\n    13.​ complete codes & note\n             ○​ D2330 (Resin-based comp - 1 surf, ant.)\n             ○​ D2391 (Resin-based comp - 1 surf, post.)\n    14.​ check in — have instructor swipe your EPR/codes/notes\ncomposite — class V: note template\n - y/o female patient presents to Vivaldi clinic for #5-B composite\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #5.\n\n #5-B:\n Placed Isodry (size M). [ Pt has non-carious cervical lesion that does not require caries excavation. Surface roughened with diamond burs. ]\n Removed existing failing B composite restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation to ideal form.\n Placed gingival retentive groove & M,D incisal retentive points. Placed gingival retraction cord #0 soaked with Hemodent. Scrubbed with Consepsis\n 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for\n 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure.\n Removed cord. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy brush. Patient is satisfied. Gave post-op instructions\n re: numbness, sensitivity, sore injection site.\n\n - NV:"
},
{
"id": "c033.0",
"section": "RESTORATIVE",
"title": "COMPOSITE VENEERS — resources",
"body": "resources\n    ●​ Link to \"Diastema Closure Instructions\"\n    ●​ Link to Dr. Baroudi's Veneers Presentation\n    ●​ Link to Dr. Baroudi's Anterior Layering Technique"
},
{
"id": "c033.1",
"section": "RESTORATIVE",
"title": "COMPOSITE VENEERS — composite veneers: equipment",
"body": "composite veneers: equipment\n   ●​ from sterilization: composite kit, handpieces, prophy handpiece, fixed prosth burs, restorative burs, composite finishing\n       burs, Vita shade guide, composite gun, curing light, septocaine, patient goggles, blood glucose kit\n   ●​ from locker: blood pressure cuff, loupes and/or eye protection\n   ●​ in clinic: composite, articulating paper, clear mylar strip, wooden wedges, etch, ScotchBond, Shofu, finishing strips, #12\n       scalpel, discs, enamelize, cords + Hemodent + dappen dish\n   ●​ in unit: anesthetic needle/carpule/shield/topical, prophy angle, prophy paste, floss"
},
{
"id": "c033.2",
"section": "RESTORATIVE",
"title": "COMPOSITE VENEERS — composite veneers: steps",
"body": "composite veneers: steps\n   1.​ get a start check\n   2.​ check occlusion\n            ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                 adjacent teeth (or other teeth on that side)\n            ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                 occlusion (especially making sure occlusion on adjacent teeth is the same)\n   3.​ deliver local anesthetic\n   4.​ clean tooth\n            ○​ clean the tooth with fluoride-free pumice & prophy angle\n   5.​ select a shade\n            ○​ use a shade guide to find the closest shades\n            ○​ without etching or bonding, apply a trial amount of composite shades to the tooth & cure to evaluate shade\n                 selection (then remove)\n            ○​ select shade with both room light, overhead light, & natural light\n   6.​ place gingival retraction cord as needed\n   7.​ complete prep\n            ○​ depending on the tooth shape, the tooth may not need to be prepared\n                      ■​ if closing a diastema or restoring a peg lateral, little or no tooth preparation is required\n            ○​ use a flame-shaped diamond bur to prepare teeth for composite veneers\n            ○​ whenever possible, keep the preparation in enamel to ensure strongest bond\n            ○​ facial preparation:\n                      ■​ facial is commonly reduced 0.3 - 0.5 mm using a depth guide\n                      ■​ facial reduction is less gingivally and more incisally\n            ○​ interproximal preparation:\n                      ■​ the interproximal finish line should be hidden within the contact (beyond the visible mesiobuccal &\n                          distobuccal line angles)\n                      ■​ the contact area should be preserved\n                      ■​ the contact may be broken if the shape or position of a group of teeth needs to be changed; the contact\n                          may be broken when caries or preexisting restorations extend into the contact area\n            ○​ gingival preparation:\n                      ■​ finish line should be feather edge / beveled to maximize esthetics\n                      ■​ wide bevels on the facial are required for a seamless transition between tooth & composite\n   8.​ check in — have instructor check your prep; refine it until they approve\n   9.​ place matrix & wedge\n            ○​ place a clear mylar matrix & wedge\n   10.​ etch & bond\n            ○​ etch: etch enamel first, then dentin → wait 15s → rinse & lightly dry, leaving dentin moist (use high-evacuation\n                 suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n                      ■​ if only etching enamel, etch 30s\n            ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n            ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n   11.​ place composite\n            ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n\n              ○​ cure the final increment for 60s\n              ○​ usually veneers are thin enough that one increment works & looks best (no composite junction lines)\n    12.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper — be sure to check protrusion as this can often fracture off veneers\n              ○​ check interproximal contact with floss\n    13.​ finish & polish\n              ○​ composite finishing burs, Shofu, Cosmedent discs, Jiffy Brush, enamelize\n              ○​ discs: gray > blue > yellow > pink > Flexibuff with Enamelize paste\n    14.​ give post-op instructions\n              ○​ no incising into hard foods (apples, hard sandwiches/bread)\n              ○​ no habits (chewing ice, nail biting, toothpicks)\n              ○​ mouthguards required for sports\n              ○​ nightguard required if pt grinds\n    15.​ check in — have instructor check your restoration\n    16.​ complete codes & note\n              ○​ D2960 (Labial veneer -- resin, chairside)\n    17.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c033.3",
"section": "RESTORATIVE",
"title": "COMPOSITE VENEERS — composite veneers: note template",
"body": "composite veneers: note template\n - y/o female patient presents to Vivaldi clinic for #8-9 composite veneers\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as buccal infiltrations\n in anterior maxilla. Placed gingival retraction cords #0 soaked in Hemodent.\n\n #8-9 composite veneers:\n Lightly prepared teeth to receive composite veneers, including wide facial bevel. Placed clear mylar strip & wedge. Etched with 35% phosphoric\n acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Repeated with both teeth, #8 & #9. Removed cords. Evaluated occlusion with articulating paper, adjusted to ideal.\n Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, no biting into foods with incisors.\n\n - NV:"
},
{
"id": "c034.0",
"section": "RESTORATIVE",
"title": "RMGI — follow the steps for composite, as above, with the following modifications",
"body": "follow the steps for composite, as above, with the following modifications\n\nKetac Nano — used in UG clinic\n    ●​ Ketac Nano is resin-modified glass ionomer (RMGI) that is light cured\n    ●​ from sterilization: Ketac Nano capsule, Ketac Nano gun, GI cavity conditioner (primer)\n    ●​ Ketac Nano instruction guide\n    ●​ steps:\n           1.​ apply cavity conditioner → air dry → light cure 10s\n                     ■​ do not etch or bond\n                     ■​ place a drop of cavity conditioner in a dappen dish\n                     ■​ use a microbrush to apply cavity conditioner to the preparation for 15s → lightly air dry without water (!)\n                          for 10s → light cure 10s\n           2.​ activate & load capsule\n                     ■​ activate the Ketac Nano capsule by fully extending the nozzle (nozzle + capsule must be in a straight 180°\n                          line)\n                     ■​ load the activated Ketac Nano capsule into the Ketac Nano gun\n                     ■​ slowly pump the gun handle until RMGI comes out; discard the first increment\n           3.​ apply within 2 min\n                     ■​ working time is 2m 30s (RMGI will begin to set after 2m 30s)\n                     ■​ however, once the capsule is activated, RMGI must be extruded within 90s of activation — if you need\n                          multiple increments, you may need to use multiple capsules\n                     ■​ use the gun to extrude RMGI directly into the cavity\n                     ■​ only load increments that are smaller than 2 mm\n           4.​ shape\n                     ■​ contour the restoration with hand instruments\n                                ●​ hand instruments can be dipped in Ketac Nano cavity conditioner (primer) to facilitate shaping\n                                ●​ if the RMGI is super sticky or too wet to manipulate, wait 60 seconds for it to harden a bit, then\n                                   shape\n           5.​ light cure 20s\n                     ■​ light cure each increment 20s\n                     ■​ after light curing, restoration can be immediately finished with burs (no need to wait)\n\nFuji IX — used in peds\n     ●​ Fuji IX is packable glass ionomer (GI) that is auto-cure (self-cure, chemical-cure)\n     ●​ from sterilization: Fuji IX capsules, Fuji IX gun, GI cavity conditioner (primer)\n     ●​ in unit: cotton-tipped applicator\n     ●​ Fuji IX instruction guide\n     ●​ steps:\n             1.​ apply cavity conditioner\n                       ■​ do not etch or bond\n                       ■​ apply cavity conditioner to the preparation for 10s → rinse → lightly air dry but do not dessicate\n                            (preparation should remain moist)\n                       ■​ does NOT require light cure\n             2.​ amalgamate & load capsule\n                       ■​ depress the plunger on the Fuji IX capsule\n                       ■​ use the amalgamator to amalgamate the capsule for 10s\n                       ■​ load the capsule into the Fuji IX gun\n             3.​ apply within 2 minutes\n                       ■​ working time is 2 minutes\n                       ■​ use the gun to extrude GI directly into the cavity\n             4.​ shape\n                       ■​ contour the restoration with hand instruments\n                       ■​ alternatively, use a moist cotton-tipped applicator to shape\n                       ■​ GI will cure on its own (self-cure, chemical-cure, auto-cure, etc.) — does NOT require light cure\n                       ■​ wait 6 minutes from the start of mixing to allow setting) → use burs to finish"
},
{
"id": "c034.1",
"section": "RESTORATIVE",
"title": "RMGI — RMGI: note template",
"body": "RMGI: note template\n - y/o female patient presents to Vivaldi clinic for #6 class V RMGI\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #6.\n\n #5-B RMGI:\n Placed Isodry (size M). [ Pt has non-carious cervical lesion that does not require caries excavation. Surface roughened with diamond burs. ]\n Removed existing failing B composite restoration. Excavated decay using high & slow speed burs. Placed gingival retentive groove & M,D incisal\n retentive points. Prepared cavity preparation to ideal form. Placed gingival retraction cord #0 soaked with Hemodent. Scrubbed with Consepsis\n 10s to disinfect, rinsed 5s, gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Applied RMGI cavity conditioner 15s,\n air dried 10s, light cured 10s. Applied shade A2 Ketac Nano RMGI in increments, each cured 20s. Removed cord. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site.\n\n - NV:"
},
{
"id": "c035",
"section": "RESTORATIVE",
"title": "SEALANTS",
"body": "sealants\n    ●​ sealants are placed on teeth that are caries free to prevent future caries development\n    ●​ sealants are placed on teeth that have non-cavitated carious lesions limited to enamel to arrest incipient lesions\n\nsealants: equipment\n    ●​ from sterilization: composite kit, handpieces, prophy handpiece, composite finishing burs, curing light, Isodry, patient\n         goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: articulating paper, etch, ScotchBond, sealant (only available in peds)\n    ●​ in unit: prophy pumice, prophy angle\n\nsealants: steps\n    1.​ get a start check\n    2.​ isolate\n              ○​ achieve adequate isolation\n              ○​ sealant placement requires a totally dry field; Isodry is ideal isolation to avoid the need to numb for rubber dam\n                  clamp placement\n    3.​ clean the tooth\n              ○​ clean the tooth with pumice (fluoride-free) & a prophy cup\n              ○​ thoroughly dry the tooth\n    4.​ etch & bond\n              ○​ etch: etch enamel → wait 30s → rinse & lightly dry\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n                      ■​ bonding is optional, decide with faculty if you should bond (they usually want you to)\n    5.​ apply sealant\n              ○​ use included sealant brush, microbrush, or explorer to manipulate the sealant material\n              ○​ sealant material is thick — make sure you don’t apply too much or it will interfere with occlusion\n              ○​ light cure 20s\n    6.​ check for excess\n              ○​ most common area for excess is distal of mandibular molars, near/under gingiva\n    7.​ check occlusion\n              ○​ check occlusion with articulating paper\n    8.​ complete codes & note\n              ○​ D1351 (Sealant - per tooth)\n    9.​ check in — have your instructor check your sealant & swipe your EPR/codes/note\n\nsealants: note template\n - y/o female patient presents to Vivaldi clinic for sealants\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Sealants — #2, #3, #14, #15, #18, #19, #30, #31\n Tooth cleaned with pumice & prophy angle. Isodry placed (size M). Etched with 35% phosphoric acid for 30s, rinsed 15s, gently dried. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit of mandibular molars /\n lingual groove of maxillary molars. Light cured 20s. Repeated for all molars (#2, #3, #14, #15, #18, #19, #30, #31). Occlusion evaluated with\n articulating paper -- occlusion is satisfactory, pt is not occluding on sealant.\n\n - NV:"
},
{
"id": "c036.0",
"section": "RESTORATIVE",
"title": "OCCLUSAL GUARD — in Axium, click Links → Occlusal Guard Clinical Experience",
"body": "in Axium, click Links → Occlusal Guard Clinical Experience\n\nappointment #1: records\n\nequipment\n    ●​ from sterilization: exam kit, Regisil gun, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, alginate mixing bowl, spatula\n    ●​ in clinic: alginate, water cylinder, impression trays, alginate spray adhesive, Regisil\nsteps\n    1.​ get a start check\n    2.​ take facebow\n             ○​ also take bite registration if hand articulation will not be possible\n    3.​ take impressions\n             ○​ take impressions with alginate\n             ○​ immediately pour up in Microstone\n    4.​ complete codes & note\n             ○​ D9944A (Impression)\n             ○​ complete treatment note\n    5.​ check in\n             ○​ have instructor swipe EPR/code/note\n\nnote template\n - y/o female patient presents to Vivaldi clinic to take records for occlusal guard.\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Took alginate impressions & facebow for occlusal guard fabrication.\n\n NV: occlusal guard delivery\n\nlab\n      1.​   close incisal pin to –2 mm before mounting\n      2.​   mount maxillary cast using facebow\n      3.​   mount mandibular cast in MI via hand articulation or bite registration\n      4.​   open incisal pin until you achieve 1 mm clearance during excursive movements between canines & posterior teeth\n      5.​   complete lab script in Axium\n            lab script template\n             Please fabricate maxillary full arch flat plane occlusal guard. Please process in dual layer acrylic with VDO raised to create at least 1\n             mm space measured between the tips of the canines & all posterior teeth during eccentric movements (pin +3 mm). Please achieve all\n             of the following:\n             (a) point-to-flat-plane contact in centric (buccal cusps & incisal edges of mandibular teeth)\n             (b) 1-2 mm of freedom in centric\n             (c) minimal incisal guidance, but enough to disclude posterior teeth in protrusion\n             (d) canine guidance during lateral excursion\n             Please return for delivery. Thank you.\n\n      6.​ send to lab: lab script, mounted casts (articulator optional)"
},
{
"id": "c036.1",
"section": "RESTORATIVE",
"title": "OCCLUSAL GUARD — appointment #2: delivery",
"body": "appointment #2: delivery\n\nequipment\n    ●​ from sterilization: exam kit, lab lab burs, lab handpiece, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, occlusal guard from lab\n    ●​ in clinic: horseshoe articulating paper\n\nsteps\n    1.​ get a start check\n    2.​ evaluate & adjust occlusal guard\n             ○​ put occlusal guard in patient’s mouth → have them bite to MI & use articulating paper to capture centric contacts\n                  posteriorly (both sides) & anteriorly\n                       ■​ adjust so that both sides have equal & distributed contact\n             ○​ put occlusal guard in patient’s mouth → have them make lateral movements & use articulating paper to evaluate\n                  for canine guidance\n                       ■​ get rid of any posterior contact to achieve canine guidance (only contact on canines)\n             ○​ put occlusal guard in patient’s mouth → have them make protrusive movements & use articulating paper to\n                  evaluate contacts\n                       ■​ the goal is minimal incisal guidance (no heavy contacts), but enough to disclude the posterior teeth\n             ○​ use lab burs to adjust occlusal guard to ideal contacts\n             ○​ overall goals:\n                       ■​ in CO: bilateral centric contacts\n                       ■​ in protrusion: minimal incisal guidance + posterior disclusion\n                       ■​ in lateral movements: canine guidance\n    3.​ give post-op instructions\n             ○​ wear to bed every night\n             ○​ you must brush your teeth before you put the guard in\n             ○​ patient may salivate more than usual\n                       ■​ if salivation is too much to sleep with, wear for a few hours after dinner while awake to get used to it\n             ○​ every morning, rinse with cold water & brush gently with toothbrush & toothpaste\n             ○​ print post-op instructions & give to pt\n    4.​ complete code & note\n             ○​ D9944B (Delivery)\n             ○​ I9002 (Lab quality review)\n    5.​ check in — have instructor check occlusal guard; have instructor swipe EPR/codes/note\n\nnote template\n - y/o female patient presents to Vivaldi clinic for occlusal guard delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Occlusal guard delivery:\n\n Tried in occlusal guard, evaluated with articulating paper, & adjusted with lab burs to achieve: (1) bilateral centric contact in occlusion, (2)\n posterior disclusion & minimal incisal guidance in protrusion, (3) canine guidance in lateral movements.\n\n Instructed pt how to insert & remove occlusal guard; pt was able to do so unaided. Instructed pt how to use & maintain occlusal guard. Printed\n post-op instructions given to pt.\n\n NV:"
},
{
"id": "c037.1",
"section": "FIXED",
"title": "FIXED — crown prep: equipment",
"body": "crown prep: equipment\n    ●​ from sterilization: composite kit, fixed prosth kit, rubber dam kit, handpieces, fixed prosth burs, restorative burs, extra-oral\n        provisional burs, composite finishing burs, Integrity gun, PVS gun (2), composite gun, curing light, Garrison kit (1-2), Vita\n        shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n    ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: composite (lighter/darker shade) or core-buildup material (Bisco Blue or White), articulating paper, microbrushes,\n        etch, ScotchBond, Gluma, Shofu, TempBond + mixing pad or UltraTemp + tips, cords + Hemodent + dappen dish, Integrity +\n        tip, impression trays, PVS adhesive + dappen dish + brushes, light body PVS + tips, heavy body PVS + tips, lab putty &\n        activator, rubber dam\n    ●​ in unit: anesthetic needle/carpule/shield/topical, floss, vaseline"
},
{
"id": "c037.2",
"section": "FIXED",
"title": "FIXED — crown prep: steps",
"body": "crown prep: steps\n    1.​ make a putty\n             ○​ before you bring in the patient, make a putty of the cast so you have a putty to use for provisionalization\n    2.​ get a start check\n    3.​ check occlusion\n             ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                  adjacent teeth (or other teeth on that side)\n             ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                  occlusion (especially making sure occlusion on adjacent teeth is the same)\n    4.​ deliver local anesthetic\n    5.​ select a shade\n             ○​ select a shade for the final crown\n             ○​ use overhead light, ambient light, & natural light\n    6.​ isolate with rubber dam or isodry\n             ○​ don’t forget to tie floss to the clamp\n    7.​ pre-wedge\n             ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n             ○​ pre-wedge mesial & distal for MOD\n    8.​ remove decay / existing restoration\n             ○​ completely remove existing restoration\n                       ■​ check with instructor first — if pt’s composite/amalgam is sound it may not need to be removed\n             ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n             ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n             ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                  drying or scratching with an explorer (composite scratches, tooth does not)\n    9.​ check in — have instructor check that all decay is removed\n    10.​ place matrix & wedge\n             ○​ place sectional matrix band (smiling toward occlusal) → place plastic wedge → place Garrison ring → burnish\n                       ■​ don’t forget to tie floss to the Garrison ring\n                       ■​ you can use 2 Garrison rings for an MOD\n             ○​ or, place place Tofflemire retainer + universal matrix band + wooden wedge, then burnish\n                       ■​ the closed end of the Tofflemire retainer goes toward the occlusal surface of the teeth\n                       ■​ the matrix band should be narrower gingivally & wider occlusally\n    11.​ clean prep with Consepsis\n             ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n    12.​ place liner or base, if indicated\n             ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n             ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                            → cover with Vitrebond (see above)\n    13.​ etch & bond\n\n          ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n               suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n          ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n               lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n               glossy without pooling)\n                    ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n          ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n          ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n14.​ buildup\n          ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n                    ■​ choose a composite of a drastically darker or lighter shade so the composite is easily discernible from\n                         tooth when doing the crown prep next time\n          ○​ cure the final increment for 60s\n          ○​ or, place Bisco blue or Bisco white in increments & cure 20-40s after each increment (depending on increment size)\n15.​ check in — have instructor check buildup\n16.​ complete crown prep\n          ○​ initial interproximal reduction — flame-shaped diamond bur\n          ○​ occlusal reduction\n          ○​ axial reduction\n                    ■​ place depth cuts first\n                    ■​ keep finish line supragingival/equigingival (you can always lower it later)\n          ○​ functional cusp bevel\n          ○​ final axial & occlusal modifications\n17.​ check in — have instructor check prep before provisional fabrication\n18.​ fabricate provisional\n          ○​ fabricate (but don’t cement) the provisional before you take the final impression; this ensures you won’t run out of\n               time\n19.​ check in — have instructor check provisional before taking final impression\n20.​ pick a tray size & apply adhesive\n          ○​ size the appropriate impression tray\n          ○​ apply adhesive USING A CLEAN BRUSH EVERY TIME OR USING A DAPPEN DISH — brushes that touch the tray are\n               contaminated with pt’s saliva; double dipping in the bottle contaminates all the adhesive\n          ○​ only apply a thin layer of adhesive (if adhesive pools or drips, there’s too much) — don’t double dip the brush\n          ○​ allow the adhesive to dry (can take 5 min)\n21.​ pack 2 cords\n          ○​ cords should be sitting in a dappen dish of Hemodent to soak\n          ○​ pack the first (smaller) bottom cord under the prepared margin to control seepage & bleeding\n                    ■​ the bottom cord should not have a tail; cut the cord so that the entire cord is submerged in the sulcus\n          ○​ pack the second (larger) top cord above the first to further expand the sulcus\n                    ■​ half of the width of the top cord should fit into the sulcus — the cord should be entirely visible around the\n                         circumference of the tooth; any areas that the cord is submerged below the gingiva will result in gingival\n                         collapse once the cord is removed & will ruin the final impression\n                    ■​ leave a tail for easy removal\n          ○​ you will quickly remove the top cord prior to taking the impression to create an access space for impression\n               material; leave the bottom cord in place during the impression to control bleeding & seepage\n22.​ take final impression\n          ○​ warn your patient how awful this final impression is going to be; explain/show how to put their chin down, give\n               them paper towels, get suction ready\n          ○​ you’ll need someone to help you (instructor, another student, assistant)\n          ○​ have your assistant load the tray with heavy body PVS (don’t need that much; for maxillary, just load a U-shape, no\n               need to fill the palate)\n          ○​ thoroughly dry the prep & adjacent teeth with the air/water syringe\n          ○​ quickly remove the top cord\n          ○​ use the micro-tip to apply light body PVS into the gingival sulcus\n          ○​ apply light body PVS all around the crown prep circumferentially in the same direction (do not switch direction)\n          ○​ seat the tray loaded with heavy-body\n          ○​ allow the full 6 minutes to set (set a timer)\n          ○​ remove impression\n23.​ check in — have instructor check final impression\n\n    24.​ send final impression & lab script to lab\n    25.​ cement provisional\n             ○​ always always always apply Gluma to the crown prep before cementing the provisional!!! lots of patients are super\n                  sensitive after crown preps with their provisional crown — exception: RCT teeth don’t need Gluma (duh)\n             ○​ check occlusion & ensure excess cement is removed\n             ○​ REMOVE CORDS\n    26.​ check in — have instructor check provisional after cementing\n    27.​ complete codes & note\n             ○​ D2950 (Core buildup - including pins)\n             ○​ code for initial preparation:\n                      ■​ D2790A (Initial Preparation, for parent code D2790: Crown -- Full cast high noble mt)\n                      ■​ D2750A (Initial Preparation, for parent code D2750: Crown -- PFM high noble metal)\n                      ■​ D2740A (Initial Preparation, for parent code D2740: Crown -- Porcelain/ceramic subs)\n             ○​ code for final impression:\n                      ■​ D2790B (Final Impression, for parent code D2790: Crown -- Full cast high noble mt)\n                      ■​ D2750B (Final Impression, for parent code D2750: Crown -- PFM high noble metal)\n                      ■​ D2740B (Final Impression, for parent code D2740: Crown -- Porcelain/ceramic subs)\n    28.​ check in — have instructor swipe EPR/codes/note/lab script\n\nlab script example: die trim\n Please pour impression, Pindex, & return for die trimming. Thank you.\n\nlab script example: PFM crown\n Please pour impression & fabricate PFM crown for #30 using high-noble alloy.\n Occlusal and interproximal contacts should be in porcelain.\n 1-2 mm metal collar on the lingual margin, no metal collar on the buccal margin.\n Shade A2.\n Thank you.\n\n metal dimensions (and Zirconia)              PFM dimensions                               all-ceramic dimensions (not Zirconia)\n axial reduction       1.00 - 1.25 mm         axial reduction      1.25 - 1.50 mm          axial reduction      1.25 - 1.50 mm\n occlusal reduction    1.25 - 1.50 mm         occlusal reduction   1.5 - 2.0 mm            occlusal reduction   1.5 - 2.0 mm\n                       0.5 - 0.8 mm                                1.0 - 1.25 mm                                1.0 - 1.25 mm\n finish line                                  finish line                                  finish line\n                       chamfer                                     deep chamfer                                 deep chamfer\ncrown properties\n    ●​ metal\n            ○​ strongest type of crown\n            ○​ requires less tooth reduction\n            ○​ due to poor esthetics, usually limited to molars\n    ●​ PFM\n            ○​ the middle-ground for esthetics & strength\n                   ■​ not as esthetic is ceramic, but stronger than ceramic\n                   ■​ not as strong as gold, but more esthetic than gold\n    ●​ all-ceramic\n            ○​ porcelain (feldspathic porcelain)\n                   ■​ most translucent = weakest\n                   ■​ used only for veneers\n            ○​ glass ceramic (lithium disilicate)\n                   ■​ have good balance between strength & translucency\n                   ■​ can be used for anterior or posterior restorations\n            ○​ polycrystalline (zirconia)\n                   ■​ very very strong = most opaque\n\nwhich crown?\n    ●​ PFM crowns are used when strength & esthetics are both a priority (most posterior crowns will be PFM)\n    ●​ ceramic crowns (digital) are used when esthetics are a priority (most anterior crowns will be ceramic)\n    ●​ there is no right or wrong crown material — talk with your instructor before you treatment plan\n\nprovisional materials\n    ●​ PMMA = Jet Set 4\n    ●​ PEMA = Snap\n    ●​ bis-acryl = Integrity"
},
{
"id": "c038.0",
"section": "FIXED",
"title": "CORE BUILDUP — core buildup: equipment",
"body": "core buildup: equipment\n    ●​ from sterilization: composite kit, rubber dam kit, handpieces, restorative burs, composite finishing burs, composite gun,\n         curing light, Garrison kit (1-2), Vita shade guide, Isodry, septocaine, patient goggles, blood glucose kit\n    ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: composite (lighter/darker shade) or core-buildup material (Bisco Blue or White), articulating paper, microbrushes,\n         wooden wedges, plastic wedges, matrix band, wedget, Consepsis, etch, ScotchBond, Gluma, Shofu, cords + Hemodent +\n         dappen dish, rubber dam\n    ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c038.1",
"section": "FIXED",
"title": "CORE BUILDUP — core buildup: steps",
"body": "core buildup: steps\n    1.​ make sure you have a cast\n             ○​ before you start, make sure you have a diagnostic cast to make a putty off of in the future\n             ○​ if the tooth shape is not ideal, you can take an impression after the core buildup or wax-up the tooth on the cast\n    2.​ get a start check\n    3.​ check occlusion\n             ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                  adjacent teeth (or other teeth on that side)\n             ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                  occlusion (especially making sure occlusion on adjacent teeth is the same)\n    4.​ deliver local anesthetic\n    5.​ select a shade\n             ○​ select a shade for the final crown; this serves as a basis that you can re-confirm at the next visits\n             ○​ select a shade for the buildup composite — choose a composite of a drastically darker or lighter shade so the\n                  composite is easily discernible from tooth when doing the crown prep in the future\n    6.​ isolate with rubber dam or isodry\n             ○​ don’t forget to tie floss to the clamp\n    7.​ pre-wedge\n             ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n             ○​ pre-wedge mesial & distal for MOD\n    8.​ remove decay / existing restoration\n             ○​ completely remove existing restoration\n                       ■​ check with instructor first — if pt’s composite/amalgam is sound it may not need to be removed\n             ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator\n             ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n             ○​ if removing an existing composite, you can determine the difference between composite & tooth by thoroughly\n                  drying or scratching with an explorer (composite scratches, tooth does not)\n    9.​ check in — have instructor check that all decay is removed\n    10.​ place matrix & wedge\n             ○​ place sectional matrix band (smiling toward occlusal) → place plastic wedge → place Garrison ring → burnish\n                       ■​ don’t forget to tie floss to the Garrison ring\n                       ■​ you can use 2 Garrison rings for an MOD\n             ○​ or, place place Tofflemire retainer + universal matrix band + wooden wedge, then burnish\n                       ■​ the closed end of the Tofflemire retainer goes toward the occlusal surface of the teeth\n                       ■​ the matrix band should be narrower gingivally & wider occlusally\n    11.​ clean prep with Consepsis\n             ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n    12.​ place liner or base, if indicated\n             ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n             ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                            → cover with Vitrebond (see above)\n    13.​ etch & bond\n\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ apply Gluma: apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s →\n                  lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be\n                  glossy without pooling)\n                       ■​ if applying Gluma for desensitization, the correct sequence is: etch → Gluma → bond\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    14.​ buildup\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n                       ■​ choose a composite of a drastically darker or lighter shade so the composite is easily discernible from\n                            tooth when doing the crown prep next time\n              ○​ cure the final increment for 60s\n              ○​ or, place Bisco blue or Bisco white in increments & cure 20-40s after each increment (depending on increment size)\n    15.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    16.​ finish\n              ○​ composite finishing burs, Shofu\n    17.​ check in — have instructor check buildup\n    18.​ complete codes & note\n              ○​ D2950 (Core buildup - including pins)\n    19.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c038.2",
"section": "FIXED",
"title": "CORE BUILDUP — core buildup: note template",
"body": "core buildup: note template\n - y/o female patient presents to Vivaldi clinic for #19 core buildup (for PFM crown)\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 core buildup:\n Placed Isodry (size M). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. Scrubbed with Consepsis 10s to disinfect, rinsed 5s,\n gently dried. Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried\n leaving dentin moist. Applied Gluma 45s to desensitize, air dried, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s,\n air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Restoration finished using\n finishing diamond burs & Shofu. Interproximal contact evaluated with floss & adjusted to ideal. Occlusion evaluated with articulating paper &\n adjusted to ideal. Patient is satisfied. Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n - NV: #19 PFM crown prep"
},
{
"id": "c039.0",
"section": "FIXED",
"title": "CROWN PREP — crown prep: equipment",
"body": "crown prep: equipment\n    ●​ from sterilization: fixed prosth kit, handpieces, fixed prosth burs, restorative burs, extra-oral provisional burs, composite\n        finishing burs, Integrity gun, composite gun, curing light, Vita shade guide, blood glucose kit\n    ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: flowable composite, articulating paper, microbrushes, Gluma, TempBond + mixing pad or UltraTemp + tips, cords +\n        Hemodent + dappen dish, Integrity + tip, lab putty + activator\n    ●​ in unit: anesthetic needle/carpule/shield/topical, vaseline, floss"
},
{
"id": "c039.1",
"section": "FIXED",
"title": "CROWN PREP — crown prep: steps",
"body": "crown prep: steps\n    1.​ make a putty\n             ○​ before you bring in the patient, make a putty of the cast so you have a putty to use for provisionalization\n    2.​ get a start check\n    3.​ check occlusion\n             ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                  adjacent teeth (or other teeth on that side)\n             ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                  occlusion (especially making sure occlusion on adjacent teeth is the same)\n    4.​ deliver local anesthetic\n    5.​ select a shade\n             ○​ select a shade for the final crown\n             ○​ use overhead light, ambient light, & natural light\n    6.​ complete crown prep\n             ○​ initial interproximal reduction — flame-shaped diamond bur\n             ○​ occlusal reduction\n             ○​ axial reduction\n                       ■​ place depth cuts first\n                       ■​ keep finish line supragingival (you can always lower it later)\n             ○​ functional cusp bevel\n             ○​ final axial & occlusal modifications\n    7.​ check in — have instructor check prep before provisional fabrication\n    8.​ fabricate provisional\n    9.​ check in — have instructor check provisional before cementing\n    10.​ cement provisional\n             ○​ always always always apply Gluma to the crown prep before cementing the provisional!!! lots of patients are super\n                  sensitive after crown preps with their provisional crown — exception: RCT teeth don’t need Gluma (duh)\n             ○​ check occlusion & ensure excess cement is removed\n             ○​ REMOVE CORDS\n    11.​ check in — have instructor check provisional after cementing\n    12.​ complete codes & note\n             ○​ code for initial preparation:\n                       ■​ D2790A (Initial Preparation, for parent code D2790: Crown -- Full cast high noble mt)\n                       ■​ D2750A (Initial Preparation, for parent code D2750: Crown -- PFM high noble metal)\n                       ■​ D2740A (Initial Preparation, for parent code D2740: Crown -- Porcelain/ceramic subs)\n    13.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c039.2",
"section": "FIXED",
"title": "CROWN PREP — crown prep: note template",
"body": "crown prep: note template\n - y/o female patient presents to Vivaldi clinic for #19 PFM crown prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 PFM crown prep + provisional:\n Completed crown prep to ideal form. Placed #0 gingival retraction cord soaked in Hemodent. Fabricated provisional using Integrity shade A2.\n Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp. Removed cord. Removed excess cement & flossed.\n Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts evaluated with floss & are\n satisfactory.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n Gave post-op instructions re: numbness, sensitivity, sore injection site, uneven bite, provisional precautions.\n\n NV:\n\n metal dimensions (and Zirconia)                      PFM dimensions                                        all-ceramic dimensions (not Zirconia)\n axial reduction          1.00 - 1.25 mm              axial reduction         1.25 - 1.50 mm                axial reduction      1.25 - 1.50 mm\n occlusal reduction       1.25 - 1.50 mm              occlusal reduction      1.5 - 2.0 mm                  occlusal reduction   1.5 - 2.0 mm\n finish line              0.5 - 0.8 mm                finish line             1.0 - 1.25 mm                 finish line          1.0 - 1.25 mm\n\ncrown properties\n    ●​ metal\n            ○​ strongest type of crown\n            ○​ requires less tooth reduction\n            ○​ due to poor esthetics, usually limited to molars\n    ●​ PFM\n            ○​ the middle-ground for esthetics & strength\n                   ■​ not as esthetic is ceramic, but stronger than ceramic\n                   ■​ not as strong as gold, but more esthetic than gold\n    ●​ all-ceramic\n            ○​ porcelain (feldspathic porcelain)\n                   ■​ most translucent = weakest\n                   ■​ used only for veneers\n            ○​ glass ceramic (lithium disilicate)\n                   ■​ have good balance between strength & translucency\n                   ■​ can be used for anterior or posterior restorations\n            ○​ polycrystalline (zirconia)\n                   ■​ very very strong = most opaque\n\nwhich crown?\n    ●​ PFM crowns are used when strength is a priority (most posterior crowns will be PFM)\n    ●​ ceramic crowns (digital) are used when esthetics are a priority (most anterior crowns will be ceramic)\n    ●​ there is no right or wrong crown material — talk with your instructor before you treatment plan\n\nprovisional materials\n    ●​ bis-acryl = Integrity\n    ●​ PMMA = Jet Set 4\n\n●​ PEMA = Snap"
},
{
"id": "c040.0",
"section": "FIXED",
"title": "PROVISIONAL CROWN — provisional: equipment",
"body": "provisional: equipment\n    ●​ from sterilization: fixed prosth kit, handpieces, fixed prosth burs, extra-oral provisional burs, composite finishing burs,\n         Integrity gun, composite gun, curing light, Vita shade guide, septocaine, patient goggles, blood glucose kit\n    ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: flowable composite, articulating paper, microbrushes, TempBond + mixing pad or UltraTemp + tips, cords +\n         Hemodent + dappen dish, Integrity + tip, lab putty & activator\n    ●​ in unit: anesthetic needle/carpule/shield/topical, vaseline, floss\n\nprovisional fabrication: Integrity (bis-acryl) — Integrity is so easy to use! make all your provisionals with integrity\n    1.​ place cord\n              ○​ place a retraction cord as needed to better visualize subgingival margins\n    2.​ load the putty with Integrity\n              ○​ dispense & discard a pea size amount of base & catalyst before installing mix tip to ensure even flow from cartridge\n              ○​ install mix tip & bleed small amount of mixed Integrity onto tray\n              ○​ inject Integrity into putty, starting with the deepest portion first then into gingival areas\n                       ■​ keep the mixing tip immersed in the material to prevent bubbles\n    3.​ seat the putty + Integrity\n              ○​ seat the filled putty within 45 seconds with gentle pressure\n              ○​ allow the material to set — leave putty in place for “2-3 minutes” (more realistically ~45 seconds) from the start of\n                  the mix (use the original bled material to judge how fast it is setting)\n    4.​ repeatedly remove & reseat the acrylic/mold\n              ○​ remove when the material reaches the firm elastic stage; monitor the curing process carefully\n                       ■​ if the provisional remains on the preparation, gently tease it off with gauze or an explorer (avoid\n                            hemostats or pliers, as they may distort the surface)\n              ○​ quickly reseat the provisional back & have patient close into maximum intercuspation\n    5.​ repair\n              ○​ gross excess can be quickly trimmed with scissors, lab burs, or coarse diamond discs\n              ○​ to repair, roughen the surface with a bur to increase bond strength of flowable resin composite\n              ○​ re-apply vaseline to tooth preparation\n              ○​ reseat provisional onto the tooth and apply flowable composite\n              ○​ for inaccessible areas like interproximals, apply composite to the crown and then carefully reseat the provisional\n              ○​ feather out the excess composite beyond the margins to ensure seamless transition\n              ○​ light cure intraorally for 20s (10s on high); remove from mouth to cure additional 20-40s\n    6.​ trim & shape\n              ○​ further trimming & refining may be performed at the completion of the set, about “6-7 minutes” after dispensing\n                  (more realistically 2-3 minutes)\n              ○​ trim gingival embrasures: remove excess material from the interproximal areas apical to the contact by holding a\n                  bur or disc parallel to the tooth emergence profile\n                       ■​ proper bur/disc angulation is important for developing appropriate anatomic contours\n              ○​ trim proximal contacts: smooth around the proximal contacts to open facial & lingual embrasures, forming convex\n                  contours — avoid directly touching the contact area with the bur, as this will create an open contact\n              ○​ trim facial & lingual contours: trim along the facial & lingual margins by holding the outer surface of the bur parallel\n                  to the tooth emergence profile\n    7.​ polish\n              ○​ remove air inhibited layer: the outer surface of the restoration may initially feel tacky due to the air-inhibited layer;\n                  most of this layer is removed during trimming and polishing, but if the surface still feels sticky, remove the layer\n                  with alcohol gauze\n              ○​ polishing: pumice & rag wheel, composite finishing instruments (Shofu point, discs, Enamelize, etc.); the surface\n                  may be glazed with a light-curing high-gloss varnish\n\nprovisional fabrication: Jet Set 4 (PMMA) — Jet is much harder to use than integrity\n    1.​ place cord\n              ○​ place a retraction cord to better visualize subgingival margins\n    2.​ mix the acrylic\n              ○​ fill a dappen dish ¾ full with acrylic (Jet Set 4) powder\n              ○​ using an eyedropper, add liquid monomer to the powder; mix with a spatula\n    3.​ fill the mold with acrylic\n\n               ○​ at the soupy stage, you can lift the spatula & bring a string of acrylic ~½” before breaking\n               ○​ pour the soupy acrylic into the mold\n    4.​   seat on teeth\n               ○​ when the sheen of the soupy acrylic disappears, the acrylic has reached the doughy stage\n               ○​ at the doughy stage, invert he mold over the teeth\n               ○​ seat the mold & hold with light pressure only in areas that have unprepared teeth underneath\n    5.​   repeatedly remove & reseat the acrylic/mold\n               ○​ when leftover acrylic can be pulled apart with a clean snap, acrylic has reached the rubbery stage\n               ○​ at the rubbery stage, remove the mold from the teeth\n                         ■​ if the provisional remains on the prep, gently remove with an explorer & place into putty\n               ○​ quickly reseat the provisional back & have patient close into maximum intercuspation\n               ○​ if the provisional was successfully placed back while the acrylic was still in the rubbery stage, very little occlusal\n                    adjustment may be needed to set the acrylic\n               ○​ when the acrylic reaches its initial set (beginning to get hot), it should be removed from the preparation, rinsed off\n                    in cold water, and reinserted for final set\n    6.​   finish/trim\n               ○​ excessive acrylic at the margins & axial contours should be trimmed off with a diamond disc\n               ○​ check proximal contacts & occlusion — having the patient bite to MI during rubbery stage can minimize adjustment\n    7.​   paint the margins\n               ○​ never paint all the margins of a provisional at once (can lock onto the prep)\n               ○​ apply vaseline to the preparation → salt & pepper technique with acrylic powder & liquid\n    8.​   polish\n               ○​ polish with acrylic polishing points, wheels, wet pumice, or lathes all on slow speed\n               ○​ final high polish is achieved with wet fine pumice & rag wheel with gentle pressure\n\nprovisional cementation\n    1.​ apply Gluma\n             ○​ always apply Gluma to the crown prep before cementing the provisional!!!lots of patients are super sensitive after\n                 crown preps with their provisional crown\n                      ■​ exception: RCT teeth don’t need Gluma (duh)\n             ○​ apply Gluma in scrubbing motion as a thin layer to entire prep for 15s → wait 30s → air dry\n    2.​ clean & dry tooth\n             ○​ if a provisional needs to be recemented with temporary cement, all original temporary cement must be removed\n                 before recementation\n             ○​ tip: apply vaseline to the outside of the provisional (not the inside or margins) to facilitate easier clean up\n    3.​ mix cement\n             ○​ mix the cement according to manufacturer’s instructions\n             ○​ if using TempBond NE: rip open foil packet → dispense equal amounts of both pastes onto mixing pad → mix\n                 together with spatula\n             ○​ if using UltraTemp: insert new tip → dispense directly into temp\n    4.​ load cement into provisional\n             ○​ apply the cement to the inside of the provisional: fill 80-90%, making sure to apply to the margins\n    5.​ seat provisional\n    6.​ clean excess cement\n             ○​ wait for cement to set halfway — cement will be goopy or crumbly, which allows easy cleaning\n             ○​ floss — floss both down & up; be sure to hold crown in place with a finger before you floss up\n    7.​ allow complete setting\n             ○​ for anterior restorations, hold the provisional place\n             ○​ for posterior restorations, have the patient bite down on a cotton roll for 2 minutes\n    8.​ adjust occlusion"
},
{
"id": "c040.1",
"section": "FIXED",
"title": "PROVISIONAL CROWN — provisional: note template",
"body": "provisional: note template\n Placed #0 gingival retraction cord soaked in Hemodent. Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory\n marginal adaptation. Cemented with UltraTemp. Removed cords. Removed excess cement & flossed. Evaluated interproximal contacts with floss,\n adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal."
},
{
"id": "c041.0",
"section": "FIXED",
"title": "CROWN FINAL IMPRESSION — crown final impression: equipment",
"body": "crown final impression: equipment\n    ●​ from sterilization: fixed prosth kit, perio cassette (for a sickle scaler), fixed prosth burs, extra-oral provisional burs, composite\n        finishing burs, handpieces, PVS gun (2), Integrity gun, composite gun, curing light, shade guide, septocaine, blood glucose kit\n    ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: flowable composite, articulating paper, microbrushes, cords + Hemodent + dappen dish, Integrity, TempBond +\n        mixing pad or UltraTemp + tips, impression trays, PVS adhesive + dappen dish + brushes, light body PVS + tips, heavy body\n        PVS + tips, lab putty & activator\n    ●​ in unit: vaseline, floss, cotton-tipped applicators"
},
{
"id": "c041.1",
"section": "FIXED",
"title": "CROWN FINAL IMPRESSION — crown final impression: steps",
"body": "crown final impression: steps\n    1.​ get a start check\n    2.​ deliver local anesthetic\n             ○​ if you aren’t packing a cord & if the patient isn’t sensitive, you don’t need to anesthetize\n    3.​ select a shade\n             ○​ select a shade for the final crown\n             ○​ use overhead light, ambient light, & natural light\n    4.​ pick a tray size & apply adhesive\n             ○​ size the appropriate impression tray\n             ○​ apply adhesive USING A CLEAN BRUSH EVERY TIME OR USING A DAPPEN DISH — brushes that touch the tray are\n                  contaminated with pt’s saliva; double dipping in the bottle contaminates all the adhesive\n             ○​ only apply a thin layer of adhesive (if adhesive pools or drips, there’s too much) — don’t double dip the brush\n             ○​ allow the adhesive to dry (can take 5 min)\n    5.​ remove provisional\n             ○​ remove provisional crown using a hemostat, spoon excavator, or anterior sickle\n                       ■​ a sharp sickle scaler (perio/SRP cassette) wedged into the crown margin in multiple places will loosen the\n                           crown & the crown should pop off\n                       ■​ you can use a hemostat, but you risk damaging the provisional (not great if you’re reusing it)\n             ○​ clean the tooth of excess cement with fixed prosth burs or a scaler\n    6.​ pack 2 cords\n             ○​ cords should be sitting in a dappen dish of Hemodent to soak\n             ○​ pack the first (smaller) bottom cord under the prepared margin to control seepage & bleeding\n                       ■​ the bottom cord should not have a tail\n             ○​ pack the second (larger) top cord above the first to further expand the sulcus\n                       ■​ half of the top cord should fit into the sulcus — the cord should be entirely visible around the\n                           circumference of the tooth; any areas that the cord is submerged below the gingiva will result in gingival\n                           collapse once the cord is removed & will ruin the final impression\n                       ■​ leave a tail for easy removal\n             ○​ you will quickly remove the top cord prior to taking the impression to create an access space for impression\n                  material; leave the bottom cord in place during the impression to control bleeding & seepage\n    7.​ take final impression\n             ○​ warn your patient how awful this final impression is going to be; explain/show how to put their chin down, give\n                  them paper towels, get suction ready\n             ○​ you’ll need someone to help you (instructor, another student, assistant)\n             ○​ have your assistant load the tray with heavy body PVS (don’t need that much)\n             ○​ thoroughly dry the prep & adjacent teeth with the air/water syringe\n             ○​ quickly remove the top cord\n             ○​ use the micro-tip to apply light body PVS into the gingival sulcus\n             ○​ apply light body PVS all around the crown prep\n             ○​ seat the tray loaded with heavy-body\n             ○​ allow the full 6 minutes to set (set a timer)\n             ○​ remove impression\n             ○​ remove bottom gingival retraction cord\n    8.​ check in — have instructor check final impression\n    9.​ recement provisional\n    10.​ send final impression & lab script to lab\n    11.​ complete codes & note\n             ○​ code for final impression:\n\n                     ■​ D2790B (Final Impression, for parent code D2790: Crown -- Full cast high noble mt)\n                     ■​ D2750B (Final Impression, for parent code D2750: Crown -- PFM high noble metal)\n                     ■​ D2740B (Final Impression, for parent code D2740: Crown -- Porcelain/ceramic subs)\n    12.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c041.2",
"section": "FIXED",
"title": "CROWN FINAL IMPRESSION — crown final impression: note template",
"body": "crown final impression: note template\n - y/o female patient presents to Vivaldi clinic for #19 PFM crown final impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #19.\n\n #19 PFM crown final impression:\n Removed provisional. Removed temporary cement. Refined preparation to ideal. Placed gingival retraction cords #00 & #0 soaked with Hemodent.\n Achieved good isolation & took final impression using heavy body PVS & light body PVS. Removed cords. Final impression & lab script sent to lab.\n\n Re-cemented provisional with UltraTemp. Removed excess cement & flossed. Evaluated interproximal contacts with floss, adjusted to ideal.\n Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Selected shade A2 for #19 PFM crown. Pt used hand mirror & confirmed shade verbally.\n\n - NV: #19 PFM delivery\n\nlab script example: die trim\n Please pour impression, Pindex, & return for die trimming. Thank you.\n\nlab script example: PFM crown\n Please pour impression & fabricate PFM crown for #30 using high-noble alloy.\n Occlusal and interproximal contacts should be in porcelain.\n 1-2 mm metal collar on the lingual margin, no metal collar on the buccal margin.\n Shade A2.\n Thank you."
},
{
"id": "c042.0",
"section": "FIXED",
"title": "CROWN DELIVERY — crown delivery: equipment",
"body": "crown delivery: equipment\n    ●​ from sterilization: fixed prosth kit, RelyX kit or FujiCem gun, perio cassette (for a sickle scaler), radiograph kit, handpieces,\n        prophy handpiece, composite finishing burs, intraoral ceramic burs, PVS gun (for fit-checker), patient goggles, blood glucose\n        kit\n             ○​ in case crown doesn’t fit, also get: PVS gun (2), shade guide, extra-oral provisional burs, Integrity gun, composite\n                  gun, curing light\n    ●​ from locker: crown from lab, blood pressure cuff, loupes and/or eye protection, crown from lab\n    ●​ in clinic: articulating paper, microbrushes, cords + Hemodent + dappen dish, fit-checker (cartridge for gun), occlude\n             ○​ in case crown doesn’t fit, also get: flowable composite, impression tray, PVS adhesive + dappen dish + brushes, light\n                  body PVS + tips, heavy body PVS + tips, Integrity, TempBond + mixing pad or UltraTemp + tips\n    ●​ in unit: floss, prophy angle, pumice"
},
{
"id": "c042.1",
"section": "FIXED",
"title": "CROWN DELIVERY — crown delivery: instructions",
"body": "crown delivery: instructions\n    1.​ before you seat the pt:\n              ○​ check fit of crown on cast to verify margins & interproximal contacts\n              ○​ soak in cavicide 5 minutes, then rinse with water\n              ○​ soak in chlorhexidine 5 minutes, then rinse with water\n    2.​ get a start check\n    3.​ check occlusion\n              ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                  adjacent teeth (or other teeth on that side)\n              ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                  occlusion (especially making sure occlusion on adjacent teeth is the same)\n    4.​ pack a cord if necessary\n    5.​ remove provisional\n              ○​ first use your fingers to see if provisional is loose/easily removed\n              ○​ if you can’t get the provisional off with your hands alone, try using a hemostat — don’t use too much force or you\n                  might damage the provisional (and if the permanent crown doesn’t fit, you’ll have to make a new provisional)\n              ○​ if you can’t get the provisional off with a hemostat, use a sickle scaler to very gently loosen the provisional at the\n                  margins — take great care not to damage the margins or the final crown won’t fit — then use a hemostat\n    6.​ try crown on\n              ○​ place gauze as a throat pack to catch the crown if it falls off\n              ○​ use floss to evaluate interproximal contacts — hold the crown with your finger so you don’t dislodge it\n              ○​ evaluate margins with an explorer\n              ○​ marginal ridges are a good way to evaluate whether crown is fully seated — if crown marginal ridges are same\n                  height as adjacent tooth marginal ridges, crown is likely fully seated\n    7.​ if crown doesn’t fit\n              ○​ adjust interproximal contacts first\n                       ■​ the most common cause for a crown failing to seat all the way is too tight of interproximal contacts\n                       ■​ mark the interproximal contacts with articulating paper → adjust crown with burs → see if crown fits now\n              ○​ if interproximal contacts are ideal, adjust the intaglio next\n                       ■​ use occlude: spray a light coat into the intaglio → seat crown → evaluate show-through in crown /\n                           evaluate markings on tooth prep\n                       ■​ or, mix Fit-Checker (equal paste-paste), apply to intaglio of crown → seat crown → evaluate show-through\n                           → adjust with burs\n    8.​ evaluate esthetics\n              ○​ ask patient if they are happy with esthetics — shape, size, & color\n    9.​ take bitewing\n              ○​ take a bitewing to verify full seating & closed margins (before cementation)\n              ○​ no need to take radiographs for anterior teeth\n    10.​ adjust occlusion\n              ○​ use articulating paper to evaluate occlusion\n              ○​ use different color articulating paper to evaluate excursive movements\n              ○​ use ceramic burs to adjust occlusion now extraorally (before cementation)\n    11.​ cement crown\n              ○​ you can use RelyX cement or FujiCem cement\n                       ■​ read RelyX instructions to see if any crown/tooth preparation is recommended\n\n                 ○​ remove all excess temporary cement with a scaler (don’t use a bur or the crown won’t fit)\n                 ○​ clean crown prep with pumice & prophy cup\n                 ○​ rinse & lightly dry, leaving dentin moist\n                 ○​ isolate with dry-angles, cotton rolls, & suction\n                 ○​ apply cement to intaglio of crown (½ to ⅔ full, make sure to cover margins)\n                 ○​ seat crown\n                 ○​ wait 1-2 minutes until cement is tacky/semi-set before flicking off excess cement with scaler or explorer\n                 ○​ floss up & down multiple times (while holding crown with finger) and floss-pull-through\n                 ○​ have patient bite on cotton roll for 3 minutes\n       12.​ verify margins, interproximal contacts, & occlusion\n                 ○​ verify margins\n                 ○​ verify interproximal contacts with floss\n                 ○​ use articulating paper to verify occlusal contacts & excursive contacts — adjust to ideal with burs\n       13.​ polish crown\n                 ○​ if you adjusted crown at all, use intraoral ceramic polishing burs in correct sequence to finish the crown\n       14.​ give post-op instructions\n                 ○​ no sticky foods for 24 hours; call if bite feels uneven or if pain\n       15.​ complete codes & note\n                 ○​ code for cementation:\n                          ■​ D2790C (Cementation, for parent code D2790: Crown -- Full cast high noble mt)\n                          ■​ D2750C (Cementation, for parent code D2750: Crown -- PFM high noble metal)\n                          ■​ D2740C (Cementation, for parent code D2740: Crown -- Porcelain/ceramic subs)\n                 ○​ D0275 (Bitewing N/C)\n                 ○​ I9002 (Lab quality review)\n       16.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c042.2",
"section": "FIXED",
"title": "CROWN DELIVERY — crown delivery: note template",
"body": "crown delivery: note template\n - y/o female patient presents to Vivaldi clinic for #19 PFM cementation\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #19 PFM cementation:\n\n Removed provisional crown. Removed temporary cement with a scaler. Cleaned tooth with pumice & prophy angle.\n\n Tried on & evaluated crown:\n - Marginal adaptation satisfactory; verified visually, tactilely, & radiographically (BW taken).\n - Interproximal contacts are satisfactory as evaluated with floss.\n - Occlusal contacts & excursive contacts are satisfactory as evaluated with articulating paper.\n - Patient approved shade & shape.\n\n Isolated with dry-angles & cotton rolls. Cemented crown with RelyX following proper manufacturer’s instructions. Removed excess cement.\n Verified marginal adaptation & interproximal contacts. Evaluated & adjusted occlusal contacts & excursive contacts to ideal. Polished ceramic. Pt\n is satisfied with bite & esthetics. Gave verbal post-op instructions re: 24 hr set, uneven bite.\n\n NV:"
},
{
"id": "c043",
"section": "FIXED",
"title": "CROWN REMOVAL",
"body": "crown removal: equipment\n    ●​ from sterilization: fixed prosth kit, handpieces, radiograph kit, fixed prosth burs, crown removing burs (anterior or posterior),\n        crown remover, Isodry, pt goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: cords + Hemodent + dappen dish\n\ncrown removal: instructions\n    1.​ make a putty\n             ○​ before you bring in the patient, make a putty of the cast so you have a putty to use for provisionalization\n    2.​ get a start check\n    3.​ deliver local anesthetic\n    4.​ select a shade\n             ○​ determine the shade of the existing crown & record it for future reference\n             ○​ choose a shade for the final crown\n             ○​ use overhead light, ambient light, & natural light\n    5.​ place cord\n             ○​ place a retraction cord as needed to better visualize subgingival margins\n    6.​ protect the throat\n             ○​ Isodry is ideal to prevent fragments of the crown from entering the throat/airway\n             ○​ gauze may also be used but is more difficult to manipulate\n    7.​ section the crown with a bur\n             ○​ use a crown-removing bur to cut through the buccal and occlusal of the crown to tooth structure\n    8.​ remove crown\n             ○​ the crown spreader is placed in the cut & gently rotated to force the halves of the crown apart — it may be\n                  necessary to section part of the lingual surface to facilitate this step\n             ○​ if unsuccessful, you may need to section the lingual too\n             ○​ be careful that the porcelain does not fracture into the patient’s mouth (risk of aspiration)\n    9.​ take radiograph\n             ○​ take a radiograph of the tooth to visualize tooth structure under the crown\n    10.​ continue treatment\n             ○​ excavate decay, complete core buildup, provisionalize, RCT, extract, etc.\n\ncrown removal: note template\n Isolated with Isodry to protect airway. Original #19-PFM crown is shade A2. Sectioned crown buccally & occlusally using crown-removing burs. Used\n crown removers to remove crown. Took BW radiograph."
},
{
"id": "c044",
"section": "FIXED",
"title": "CROWN ENDO ACCESS FILL",
"body": "crown endo access fill: equipment\n    ●​ from sterilization: fixed prosth kit, handpieces, radiograph kit, fixed prosth burs, crown removing burs (anterior or posterior),\n        crown remover, Isodry, pt goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: cords + Hemodent + dappen dish\n\ncrown endo access fill: instructions\n    1.​ get a start check\n    2.​ select a shade\n              ○​ determine the shade of the existing crown, match it with composite (try opening the “Labs” tab in EHR to see\n                  original shade of crown fabricated)\n              ○​ use overhead light, ambient light, & natural light\n    3.​ isolate\n              ○​ place Isodry or rubber dam\n    4.​ remove temp filling\n              ○​ use diamond tapered bur to remove temporary filling\n              ○​ remove sponge/cotton pellet completely\n    5.​ check in — have instructor check your access prep; refine it until they approve\n    6.​ clean access with Consepsis\n              ○​ apply Consepsis to the prep & scrub for 10s, rinse 5s, gently air-dry leaving dentin moist\n    7.​ place Vitrebond over RMGI\n              ○​ dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm) to cover gutta percha\n                  → light cure 20s\n    8.​ etch & bond\n              ○​ etch: etch → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation suction over tooth &\n                  lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    9.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    10.​ check occlusion\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n    11.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    12.​ check in — have instructor check your restoration\n    13.​ complete codes & note\n              ○​ D2950 (Core buildup - including pins)\n    14.​ check in — have instructor swipe your EPR/codes/notes\n\ncrown endo access fill: note template\n - y/o female patient presents to Vivaldi clinic for #19 PFM crown endo access fill (core buildup)\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #19 PFM crown endo access fill (core buildup):\n\n IOE reveals intact #14 crown with sound closed margins, and access filled with Cavit. BW taken recently show crown with sound, closed margins.\n\n Placed Isodry (size M). Completely removed Cavit with high speed bur. Removed sponge pellet. Applied Consepsis in scrubbing motion for 10s for\n disinfection, then rinsed. Applied 0.5 mm layer of Vitrebond to cover gutta percha, light cured 10s on high. Etched with 35% phosphoric acid for\n 10s then rinsed & gently dried, leaving dentin moist. Applied Scotchbond Universal, lightly air dried, & cured 10s on high. Shade A2 Renamel\n nanofilled composite applied in increments, each cured 20s on high. Restoration finished using finishing diamond burs & polished using Shofu.\n Occlusion evaluated with articulating paper & adjusted to ideal. Patient is satisfied.\n\n - NV:"
},
{
"id": "c045",
"section": "RPD",
"title": "RPD RESOURCES",
"body": "important links\n -​ RPD Manual (UIC)\n -​ Swade — RPD Design Guide\n -​ RPD Preliminary Design Sheet\n -​ RPD manual from Dalhousie University Dental School\n\nstudy guides\n[1] Removable Prosthodontics (Kim)\n[2] Diagnosis & Treatment Planning (Kim)\n[3] Maxillomandibular Relationships & Surveying (Kim)\n[4] Pre-Prosthetic Procedures (Touloumi)\n[5] Major & Minor Connectors (Kim)\n\n[1] Retainers (Kim)\n[2] Base, Tissue Support & Final Impression (Kim)\n[3] Temporary RPD (Hofmeister)\n\n[1] RPD Sequencing (Kim)\n[3] RPD Occlusion (Koslow)\n[4] RPD Delivery (Hofmeister)\n[5] Reline, Rebase, Repair (Koslow)\n\nlab instructions\n -​ Diagnostic Impressions\n -​ Wax Rims for Bite Registration\n -​ Facebow & Mounting Casts\n -​ Surveying & Practice Rest Seats\n -​ Guide Planes & Rest Seats\n -​ RPD Design\n -​ Intraoral Preparations\n -​ Custom Trays\n -​ Framework Try-In & Framework Wax Rims\n -​ Setting Teeth"
},
{
"id": "c046",
"section": "RPD",
"title": "COE APPOINTMENTS",
"body": "perio COE — appointment #1:\n    ●​ take diagnostic impressions & facebow at perio COE\n\nlaboratory step #1:\n    ●​ pour diagnostic casts\n    ●​ mount maxillary cast using facebow & mount mandibular cast via hand articulation\n    ●​ if you cannot hand articulate, fabricate wax rims\n\nrestorative COE — appointment #2:\n    ●​ bite registration with wax rims (ideally, take bite reg at restorative COE to save time)\n\nlaboratory step #2:\n    ●​ formulate comprehensive treatment plan\n    ●​ mount casts using bite registration\n    ●​ mount maxillary cast using facebow & mandibular cast using bite registration/wax rims\n    ●​ survey casts & design RPD by filling out RPD preliminary design sheet\n    ●​ identify need for survey crowns — do wax-ups if necessary\n\ntreatment plan appointment — appointment #3:\n    ●​ for this appointment, casts must be mounted & RPD must be designed — if you haven’t mounted casts & you’ll need wax\n       rims to do so, bring pt back for an extra quick appointment where you’ll take bite registration on wax rims\n\n                   — complete all phase 1 and phase 2 treatment before beginning RPD appointments below —"
},
{
"id": "c047",
"section": "RPD",
"title": "RPD APPOINTMENTS",
"body": "clinical appointment #1:\n     ●​ if no survey crowns: skip to clinical appointment #4\n     ●​ crown preps for survey crowns\n     ●​ 2 options:\n              ○​ prep, temp, & cement crowns 1 by 1, re-surveying each time\n              ○​ cement temps until all crown preps are finished, take final impression of all preps at once\n     ●​ send final impression to lab for pouring & Pindexing\n\nlaboratory step #1:\n    ●​ receive Pindexed master cast back from lab\n    ●​ fabricate wax rims on master cast (skip to lab step #2 if able to hand-articulate casts)\n\nclinical appointment #2:\n     ●​ take bite registration on wax rims (skip if able to hand-articulate casts)\n\nlaboratory step #2:\n    ●​ mount master cast (either hand articulate, or use bite registration on wax rims)\n    ●​ return mounted master cast to lab for fabrication of survey crowns\n    ●​ receive survey crowns from lab → survey the survey crowns on the master cast to ensure proper fabrication\n\nclinical appointment #3:\n     ●​ cement survey crowns\n     ●​ take alginate impressions\n\nlaboratory step #3:\n    ●​ duplicate diagnostic cast & practice abutment teeth preparations on cast (guide planes, HOC modification, undercut\n        modification, rest seats)\n\nclinical appointment #4:\n\n    ●​ prepare the patient’s abutment teeth\n    ●​ during the appointment: take alginate impressions → pour in Snap stone → ensure proper preparations with surveyor\n\nlaboratory step #4:\n    ●​ pour casts from alginate impressions\n    ●​ make custom trays\n\nclinical appointment #5:\n     ●​ border molding\n     ●​ final impression\n\nlaboratory step #5:\n    ●​ box & pour final impression\n    ●​ send diagnostic casts, master casts, & prescription to lab for framework fabrication\n\nclinical appointment #6:\n     ●​ metal framework try-in\n     ●​ altered cast impression, if necessary\n     ●​ select denture teeth\n     ●​ add wax to metal framework then take bite registration\n\nlaboratory step #6:\n    ●​ set denture teeth\n\nclinical appointment #7:\n     ●​ wax try-in\n\nlaboratory step #7:\n    ●​ send RPD to lab for processing\n\nclinical appointment #8:\n     ●​ RPD delivery\n\nclinical appointment #9:\n     ●​ 24 hour followup\n\nclinical appointment #10:\n     ●​ 1 week followup\n\nRPD #1: TOOTH PREPARATION"
},
{
"id": "c048",
"section": "DENTURES",
"title": "DENTURE RESOURCES",
"body": "study guides                                                      ​\n[1] Introduction to Dentures (Touloumi)                           [1] Immediate Dentures (Agrawal)\n     ●​ steps for denture fabrication                                  ●​ conventional immediate dentures\n[2] Edentulism Diagnosis & Treatment Planning (Touloumi)               ●​ interim immediate dentures\n     ●​ history taking                                            [2] Reline, Rebase, Repair (Yang)\n              ○​ House classification of denture patients              ●​ loose denture\n     ●​ EOE                                                            ●​ chairside hard reline\n     ●​ IOE                                                            ●​ lab hard reline\n     ●​ pre-prosthetic interventions                                            ○​ final impression technique\n     ●​ PDI Classification                                                      ○​ functional impression technique\n[3] Edentulous Anatomy (Obrez)                                         ●​ rebase\n     ●​ maxillary anatomy                                              ●​ repair\n     ●​ mandibular anatomy                                        [3] CAD/CAM Dentures (Touloumi)\n[4] Posterior Palatal Seal (Obrez)                                     ●​ fully digital workflow\n     ●​ posterior palatal seal                                    [4] Denture Materials (Bedran-Russo)\n     ●​ House palate classification                                    ●​ polymers\n[5] Final Impression (Touloumi)                                        ●​ polymer properties\n     ●​ final impression                                               ●​ acrylic vs. porcelain denture teeth\n     ●​ border molding                                            [5] Complete Dentures Review (Touloumi)\n[6] Wax Rims & Jaw Relation Records (Mohammad)                         ●​ common problems & how to deal with them\n     ●​ incisal display\n     ●​ phonetic analysis                                         lab instructions\n     ●​ facial analysis                                            -​ Complete Dentures Clinical Guide\n     ●​ CR                                                         -​ Pouring Final Impression; Custom Tray Fabrication\n     ●​ teeth selection                                            -​ Wax Rim Fabrication\n[7] Facebow & Articulator (Touloumi)                               -​ Denar Facebow Instruction Manual\n     ●​ articulator                                                -​ Taking a Facebow Record\n     ●​ facebow​                                                   -​ Setting Anterior Teeth\n          Hf                                                       -​ Setting Posterior Teeth (Monoplane, Balancing Ramps)\n[1] Denture Occlusion (Obrez)                                      -​ Setting Posterior Teeth (Lingualized)\n     ●​ denture occlusion                                          -​ Festooning\n     ●​ denture articulation\n     ●​ Christensen phenomenon                                    denture manual from Dalhousie University Dental School: LINK\n     ●​ choosing denture teeth\n     ●​ Hanau’s quint                                             RPD manual from Dalhousie University Dental School: LINK\n[2] Setting Anterior Teeth (Touloumi)\n     ●​ cast landmarks\n     ●​ wax-rim try-in appointment\n     ●​ determining occlusal plane\n     ●​ setting anterior teeth\n[3] Denture Try-In Appointment (Touloumi)\n     ●​ evaluating the denture’s esthetics, phonetics, VDO, CR,\n          posterior palatal seal\n     ●​ making a protrusive record\n[4] Setting Posterior Teeth (Touloumi)\n     ●​ setting posterior teeth\n[5] Festooning (Touloumi)\n     ●​ festooning\n[6] Denture Processing (Touloumi)\n     ●​ denture processing\n[7] Denture Delivery (Yuan)\n     ●​ fabricating a remount jig\n     ●​ finishing & polishing dentures\n     ●​ clinical remount\n[8] Lingualized Setup (Touloumi)\n     ●​ lingualized tooth set-up​"
},
{
"id": "c049.0",
"section": "DENTURES",
"title": "DENTURE STEPS — clinical & laboratory steps for complete denture fabrication",
"body": "clinical & laboratory steps for complete denture fabrication\n ●​ clinical appointment #1:\n         diagnosis & treatment planning\n         take diagnostic impressions (standard trays)\n\n ●​ laboratory step #1:\n        ○​ pour diagnostic impressions → diagnostic casts\n        ○​ use diagnostic casts to fabricate custom trays\n\n ●​ clinical appointment #2:\n         ○​ border molding using custom trays\n         ○​ final impression using border-molded custom trays\n\n ●​ laboratory step #2:\n        ○​ box & pour final impressions → master casts\n        ○​ use master casts to fabricate wax rims\n\n ●​ clinical appointment #3:\n         ○​ wax-rim try-in\n         ○​ jaw relation record\n         ○​ facebow\n         ○​ select denture teeth\n\n ●​ laboratory step #3:\n        ○​ mount master casts on articulator\n                 ■​ mount maxillary cast using facebow\n                 ■​ mount mandibular cast against maxillary cast using jaw relation record\n        ○​ set anterior teeth on wax rims (minimal festooning)\n\n ●​ clinical appointment #4:\n         ○​ anterior teeth try-in\n\n ●​ laboratory step #4:\n        ○​ set posterior teeth on wax rims (monoplane; lingualized; minimal festooning)\n\n ●​ clinical appointment #5:\n         ○​ posterior teeth try-in\n\n ●​ laboratory step #5:\n        ○​ instructor approves denture setup → send to lab\n\n ●​ clinical appointment #6:\n         ○​ denture delivery\n\n ●​ clinical appointment #7:\n         ○​ 24 hour follow-up\n\n ●​ clinical appointment #8:\n         ○​ 1 week follow-up\n\nDENTURE #1: COE & DIAGNOSTIC IMPRESSIONS"
},
{
"id": "c049.1",
"section": "DENTURES",
"title": "DENTURE STEPS — denture COE: equipment",
"body": "denture COE: equipment\n    ●​ from sterilization: exam kit, cheek retractors, digital camera, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, alginate mixing bowl, spatula\n    ●​ in clinic: alginate, water cylinder, impression trays, alginate spray adhesive"
},
{
"id": "c049.2",
"section": "DENTURES",
"title": "DENTURE STEPS — denture COE: steps",
"body": "denture COE: steps\n    1.​ before you seat patient\n            ○​ before you call in the patient, look up patient’s medication history (Axium eRx → Med Hx tab → Obtain New Data)\n            ○​ mark all teeth as missing\n    2.​ seat patient\n            ○​ get the patient from the waiting room & seat them in the assistant chair next to you\n            ○​ explain to the patient what will happen at today’s appointment\n    3.​ complete forms (3): med hx + medications/allergies + tobacco cessation\n            ○​ complete the patient’s medications & allergies in Axium eRx — ensure date is updated\n            ○​ under “Forms” tab, add EPR (plus sign at right) → complete the “Medical History” tab only\n                      ○​ ensure the date is updated next to “Health History Reviewed”\n            ○​ if the patient is a smoker, complete 2 tobacco codes:\n                      ○​ D1320.1 (Record Tobacco Usage) — follow the pop-up prompts to add the tobacco form\n                      ○​ D1320.2 (Provide Tobacco Cessation Education)\n                      ○​ at next apt you can complete 3rd code, D1320.3 (Tobacco Cessation Follow Up with Patient)\n    4.​ take blood pressure\n            ○​ move the patient to the dental chair & take blood pressure & pulse (blood glucose if indicated) — enter into Axium\n    5.​ check in\n            ○​ present the patient’s name, age, gender, vital signs, medical history, medications, allergies, procedure for today\n    6.​ EOE & IOE\n            ○​ complete the EOE & IOE, filling out the 3rd tab in patient EPR, “Clinical Exam”\n    7.​ determine need for preprosthetic surgery\n            ○​ determine if pt will need preprosthetic surgery:\n                      ○​ hyperplastic replacement of resorbed ridges\n                      ○​ epulis fissuratum\n                      ○​ papillomatosis\n                      ○​ unfavorable frenum attachment\n                      ○​ enlarged maxillary tuberosities\n                      ○​ bony prominences, bony undercuts, bony ridges\n                      ○​ discrepancies in jaw size relationships\n                      ○​ pressure on mental foramen\n                      ○​ limited restorative space\n                      ○​ inflammatory papillary hyperplasia\n                      ○​ vestibuloplasty\n            ○​ if pt needs pre-prosthetic surgery, fill out the “Pre-Prosthetic Surgery Form”\n                      ○​ in Axium, click “Links” at the top menu bar → click “Pre-Prosthetic Surgery Forms” → print & fill out\n    8.​ take intraoral photos\n            ○​ add the photos to Dexis\n    9.​ create treatment plan\n            ○​ create a treatment plan for the pt; usually the following codes are planned:\n                      ○​ D5110 (Complete denture - maxillary)\n                      ○​ D5120 (Complete denture - mandibular)\n                      ○​ D0103 (Phase 3 Reevaluation)\n                      ○​ D5750 (Reline comp max -- laboratory)\n                      ○​ D5751 (Reline comp man -- laboratory)\n                      ○​ D5850 (Tissue conditioning -- max)\n                      ○​ D5851 (Tissue conditioning -- man)\n                      ○​ D0120 (Periodic oral evaluation)\n            ○​ have your instructor swipe the treatment plan\n            ○​ have the patient sign the treatment plan\n    10.​ complete codes & note\n            ○​ D0150A (Initial Assessments)\n\n              ○​ D0150B (Additional Assessments)\n              ○​ D0150C (Tx Plan Developed)\n              ○​ D0350 (2D Oral/facial photo image)\n              ○​ D0475 (Diagnostic Casts -- N/C)\n              ○​ D1320.1 (Record Tobacco Usage)\n              ○​ D1320.2 (Provide Tobacco Cessation Education)\n     11.​ check in\n              ○​ have instructor swipe\n     12.​ take impressions\n              ○​ you will be fabricating custom trays from these final impressions so they’d better be good\n                        ○​ add wax if you need to extend the tray to capture the maxillary tuberosity or retromolar pad\n              ○​ to achieve ideal impressions, use cheek retractors\n              ○​ place cheek retractors in pt’s mouth — pull out & up for maxillary impression, pull out & down for mandibular\n              ○​ once you’ve positioned the cheek retractors, have pt hold them in place\n              ○​ mix alginate & load tray → position impression perfectly → seat in posterior then roll anterior\n     13.​ manage expectations\n              ○​ especially if these are pt’s first dentures, make sure to manage pt expectations\n              ○​ dentures are not real teeth — they function at 30% of a normal dentition’s 100%\n              ○​ potential problems: difficulty speaking or eating, food under dentures, loose dentures, need for adhesive, excess\n                   saliva, gum sores\n              ○​ now is a good time to briefly go over the denture consent form so the pt knows what to expect, esp. if they have\n                   never had dentures before"
},
{
"id": "c049.3",
"section": "DENTURES",
"title": "DENTURE STEPS — denture COE: note template",
"body": "denture COE: note template\n S\n - y/o female patient presents to Vivaldi clinic for COE with CC: “”\n - medical history:\n - medications:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n [ History ]\n\n O\n\n Completed extraoral exam & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n A\n - Pt is completely edentulous and needs new complete dentures fabricated. Residual ridges are suitable for F/F fabrication; no need for\n preprosthetic intervention.\n - Briefly discussed option of IOD.\n\n P\n - Took diagnostic impressions.\n - Treatment options, costs, & timelines were thoroughly reviewed with the patient. Specifically explained that dentures may take 10\n appointments, each 3 hours. Discussed advantages & disadvantages of treatments. Managed pt’s expectations with full dentures. Pt’s questions\n were answered & pt understood treatment plan. Verbal and written consent obtained.\n\n - NV: border molding & final impression with custom trays"
},
{
"id": "c049.5",
"section": "DENTURES",
"title": "DENTURE STEPS — border molding & final impression: equipment",
"body": "border molding & final impression: equipment\n    ●​ from sterilization: exam kit, waxing kit, lab handpiece, lab burs, water bath, Hanau torch, PVS guns, cheek retractors, patient\n        goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, custom trays\n    ●​ in clinic: Thompson stick, greenstick compound, #11 scalpels, PVS light body or medium body (2) + tips (2), PVS adhesive +\n        dappen dish + brushes\n    ●​ in unit: matches, tongue depressor"
},
{
"id": "c049.6",
"section": "DENTURES",
"title": "DENTURE STEPS — border molding & final impression: steps",
"body": "border molding & final impression: steps\n    1.​ before the appointment\n             ○​ get your custom trays approved by an instructor (1-2 days before appointment)\n             ○​ tell the patient the next appointment will be long & boring and have them bring something to do/read\n    2.​ get a start check\n    3.​ set water bath to 130°\n    4.​ try in & modify custom tray\n             ○​ you want the custom tray to be 2-3 mm short of the depth of the vestibule\n                       ○​ evaluate by running your fingertip along the tray in the pt’s mouth — you should be able to fit just the\n                           edge of your fingertip around the entire vestibule; if you can’t fit your fingertip, use lab burs to reduce\n             ○​ you’ll probably have to adjust the tray down in the frenum areas\n                       ○​ pull the cheeks/lips to get the frena to move → the frena should not cause the tray to move\n             ○​ have pt say “ahh” → mark vibrating line with Thompson stick → try in tray → tray should\n                  extend just anterior to the vibrating line (you should be able to see the mark)\n    5.​ check in — ask instructor to verify tray extensions\n    6.​ border molding\n             ○​ completely dry the tray — don’t forget! otherwise the compound will snap off\n             ○​ rotate greenstick compound through the Hanau torch flame, moving it constantly\n             ○​ once the compound begins to bend, quickly remove it from the flame and add it to the\n                  top of the rim of the tray in a rolling motion\n                       ○​ exception: in the maxillary posterior (#5 in image), compound is added on top of\n                           the intaglio of the tray (not at the edge)\n             ○​ use wet fingers to gently shape the compound — ideally compound is tall & narrow\n             ○​ temper the compound: dip custom tray w/ compound into hot water bath to temper\n                  compound to a comfortable temp for the pt (while keeping compound soft)\n             ○​ retract the pt’s cheek with a mirror and rotate the tray into the pt’s mouth — don’t\n                  disturb the pliable compound on the way in\n             ○​ have the pt make the appropriate mouth movements:\n                   area of custom tray                   image patient movements\n                   maxillary border molding\n                   maxillary tuberosity                   1/3     suck on finger, move jaw side to side (to capture coronoid process)\n                   buccal vestibule & labial vestibule    2/4     suck on finger, smile, gently massage lip & cheek\n                   posterior palatal seal                   5     suck on finger, swallow\n                   mandibular border molding\n                   buccal vestibule                       1/2     suck on finger, smile, open & close, gently massage cheek\n                   labial vestibule                         3     gently massage lip\n                                                                  push tongue against tray handle, touch tongue to corners of mouth,\n                   lingual vestibule                     4/5/6\n                                                                  lick upper lip, swallow\n             ○​ before you inserted the tray, the soft compound was tall, narrow, & shiny → it should now be shorter/fatter, rolled\n                & matte (not shiny), indicating that it was properly molded by the pt’s tissues\n             ○​ use a scalpel to remove any compound that has dripped into the intaglio of the tray\n                    ○​ heating the scalpel can help cut through the compound\n             ○​ use a scalpel to thin the compound buccolingually (large excess can cause improper seating)\n             ○​ repeat with entire maxillary & mandibular tray\n\n             ○​ if an area needs adjustment, use the Hanau torch to torch the compound, heating until the compound is glassy →\n                  temper → re-insert → complete movements again\n             ○​ examine final border molding for symmetry & smoothness\n                      ○​ areas with show through or shiny areas will need to be reheated with Hanau torch & re-border-molded\n             ○​ trim the compound to make it 3-4 mm wide (excess on buccal should be vertically trimmed off, intaglio-side\n                  shouldn’t be trimmed except areas that drip into the denture intaglio)\n    7.​ check in — ask instructor to verify border molding & confirm you’re ready for final impression\n    8.​ prepare tray for final impression\n             ○​ trim compound\n             ○​ remove wax spacers\n             ○​ drill a relief hole in the center of the palate of the maxillary tray (in rugae area along midline) using #8 round bur\n             ○​ apply tray adhesive & let it dry\n                      ○​ don’t forget proper infection control with PVS adhesive — use new brushes from the drawer & don’t\n                           double-dip them in the bottle\n    9.​ take final impression\n             ○​ warn patient that PVS takes 6 full minutes to set; give them a paper towel & have the suction ready\n             ○​ load light body PVS into tray — you only need a thin layer (2 mm)\n             ○​ load PVS on top of the compound\n             ○​ use a tongue depressor to roll the PVS from the inside of the tray up & over the compound\n             ○​ have patient hold cheek retractors\n             ○​ place tray very carefully\n             ○​ after 30 seconds of setting, have patient make border molding movements\n             ○​ allow the full 6 minutes to set\n             ○​ repeat with mandibular custom tray\n    10.​ check in — ask instructor to verify final impression\n    11.​ complete codes & note\n             ○​ D5110A (Final Impression)\n             ○​ D5120A (Final Impression)\n    12.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c049.7",
"section": "DENTURES",
"title": "DENTURE STEPS — border molding & final impression: note template",
"body": "border molding & final impression: note template\n - y/o female patient presents to Vivaldi clinic for F/F border molding & final impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F border molding:\n - Tried in custom trays and adjusted to ideal extension.\n - Border molded maxillary & mandibular custom trays with greenstick compound.\n - Took final impression with light-body PVS.\n\n - NV: wax rim try-in"
},
{
"id": "c049.9",
"section": "DENTURES",
"title": "DENTURE STEPS — wax rims: equipment",
"body": "wax rims: equipment\n    ●​ from sterilization: exam kit, waxing kit, lab handpiece, lab burs, Fox plane, Hanau torch, Portrait denture teeth, Vita shade\n        guide, gingival shade guide, facebow, bite fork, Regisil gun, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, stone spatula, hot plate, wax rims\n    ●​ in clinic: Thompson stick, extra-hard baseplate wax, scalpel, Regisil\n    ●​ in unit: matches, tongue depressor, floss, cotton rolls"
},
{
"id": "c049.10",
"section": "DENTURES",
"title": "DENTURE STEPS — wax rims: steps",
"body": "wax rims: steps\n    1.​ before the appointment\n             ○​ get your wax rims approved by an instructor (1-2 days before appointment)\n             ○​ tell the patient the next appointment will be long & boring and have them bring something to do/read\n    2.​ get a start check\n    3.​ mark VDR\n             ○​ use a marker to make a dot on the tip of the patient’s nose & the tip of the chin\n             ○​ ways to get patient to VDR:\n                       ○​ the “M” sound indicates lip position at rest — have the patient say “M,” “mom” or “mob”\n                       ○​ have the patient lick their lips & swallow\n                       ○​ have patient slowly close jaw until lips touch\n             ○​ use a ruler to measure the distance between the 2 dots when the patient is at VDR\n                       ○​ when measuring VDR, have the patient sit up naturally (head not against head rest), as this affects the\n                           position of the jaws\n    4.​ maxillary wax rim: evaluate incisal display\n             ○​ incisal display (at rest) based on lip length (measure lip length from base of nose to edge of upper lip)\n                    lip length    incisal display\n                   10 - 20 mm       3 - 4 mm\n                   20 - 25 mm         2 mm\n                   25 - 30 mm         1 mm\n                   30 + mm            0 mm\n             ○​ incisal display (at rest) based on age & gender\n                                         incisal display\n                       age           male           female\n                     < 45 yr         1 mm           2 mm\n                    45 - 65 yr       0 mm           1 mm\n                    65 + yr       – 1 mm           0 mm\n    5.​ maxillary wax rim: evaluate incisal edge position, phonetics, & lip support\n           ○​ have the patient say “fifty five” → incisal edge of maxillary wax rim should contact vermillion border of lower lip\n           ○​ have the patient say “E” → maxillary incisal edge should be halfway between the upper & lower lip\n           ○​ evaluate lip support — does the patient look too full? does the patient look collapsed?\n                     ○​ in general, women have less lip support (larger nasolabial angle) than men\n                     ○​ the vermillion border of both lips should be visible when the patient is closed\n           ○​ evaluate buccal corridors (buccal extension)\n    6.​ maxillary wax rim: evaluate occlusal plane\n           ○​ use Fox plane\n                     ○​ place maxillary wax rim into pt’s mouth → place Fox plane against maxillary wax rim\n           ○​ when viewed from straight on → occlusal plane should be parallel to interpupillary line\n           ○​ when viewed from profile → occlusal plane should be parallel to ala-tragus line\n                     ○​ hold a tongue depressor from the base of the nose to the center of the tragus to compare\n    7.​ mandibular wax rim: match VDO\n           ○​ adjust mandibular wax rim to meet maxillary wax rim perfectly at VDO: VDO = VDR – 2 mm\n           ○​ evaluate: have the patient say “Emma” and “Mississippi” → maxillary & mandibular wax rims should not touch\n                     ○​ when saying sibilant sounds (Mississippi), 1 mm of distance between wax rims is ideal\n           ○​ maxillary wax rim should have 1-2 mm overjet when in contact with mandibular wax rim\n           ○​ posteriorly, mandibular wax rim should be at ⅔ the height of the retromolar pad​\n\n8.​ mark maxillary wax rim\n         ○​ mark midline\n                   ○​ one way to do this is use a piece of floss & hold it vertically down the patient’s midline\n                   ○​ evaluate the midline of the forehead, bridge of nose, tip of nose, philtrum, & tip of chin\n         ○​ mark canine lines (edge of ala of nose)\n         ○​ have patient smile & mark the high smile line\n9.​ check in — have instructor check wax rims\n10.​ take facebow\n         ○​ make 1 giant keyhole notch on each side of the maxillary & mandibular wax rims using a hot\n              instrument or scalpel (like in the image, side/profile view of wax rims)\n         ○​ get the facebow ready — loosen all the screws, separate the earpieces fully, connect the\n              transfer assembly to the earpieces\n         ○​ use a ruler & marker to mark the anterior reference point — 43 mm above the lateral incisor (wax rim)\n         ○​ insert the maxillary wax rim into the patient’s mouth\n         ○​ apply Regisil to the bitefork → insert against the maxillary wax rim, making sure the midline of the wax rim\n              matches the midline of the bite fork\n         ○​ stabilize the bitefork by having the patient bite down on cotton rolls\n         ○​ slide the bitefork into the transfer assembly → continue to slide until the patient can put the earpieces in their ears\n         ○​ align the pointer with the reference point mark\n         ○​ tighten all screws as tight as you possibly can — they literally need to be SO SO SO tight or they will loosen\n         ○​ wait for Regisil to set, then remove\n11.​ take bite registration\n         ○​ practice having patient close to CR with maxillary & mandibular wax rims in place\n         ○​ have the patient close to CR\n         ○​ with the patient already biting in CR with the wax rims in, shoot Regisil into the keyholes (like in image)\n         ○​ this technique gets the most accurate mounting because sometimes if you put Regisil on the entire wax rim and\n              have the patient close, they will close unevenly or not all the way\n12.​ select denture teeth\n         ○​ the shape of denture teeth is determined by either (a) the pt’s original teeth (if you have a photo or a diagnostic\n              cast before extractions), or (b) the pt’s old denture, or (c) the pt’s face shape\n         ○​ measure the maxillary intercanine distance with a ruler\n         ○​ measure the high smile line with a ruler\n         ○​ based on the shape, intercanine distance, & high smile line, select an appropriate denture tooth mold\n         ○​ select a tooth shade & a gingival shade based on patient preference — most common is A2/B2 or A3/B3\n                   ○​ ask the patient if they want whiter or more natural-looking teeth — this will tell you a lot of info\n                   ○​ based on their answer, show them A2 or A3, then compare with either B2 or B3\n         ○​ complete tooth requisition form (complete form, print, & sign)\n13.​ check in — have instructor confirm tooth selection\n14.​ complete codes & note\n         ○​ D5000NC (In-Process Step or PO Removable) for both upper arch & lower arch\n15.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c049.11",
"section": "DENTURES",
"title": "DENTURE STEPS — wax rims: note template",
"body": "wax rims: note template\n - y/o female patient presents to Vivaldi clinic for F/F wax rim try-in\n - medical history: RMH, no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F wax rims:\n\n - Tried in maxillary wax rim. Adjusted record base for ideal fit.\n - Used Fox plane to adjust maxillary occlusal plane parallel to ala-tragus line & interpupillary line.\n - Adjusted maxillary wax rim to produce ideal phonetics, lip support, & incisal display.\n - Marked midline on maxillary wax rim; pt approves. Marked canine lines & high smile line.\n\n - VDR marked.\n - Tried in mandibular wax rim. Adjusted record base for ideal fit.\n - Adjusted occlusal plane to match maxillary occlusal plane & achieve proper VDO.\n\n - Evaluated multiple denture tooth shades with pt. Selected tooth shade B1. Selected gingival shade OR (original). Pt is satisfied with these\n choices.\n - intercanine distance: 50.0 mm\n - high smile line: 10.0 mm\n - Based on intercanine distance & high smile line, selected anterior maxillary tooth mold 32E. Corresponding mandibular tooth mold: C.\n\n - Took facebow & jaw relation record.\n\n - NV: anterior wax try-in"
},
{
"id": "c049.13",
"section": "DENTURES",
"title": "DENTURE STEPS — anterior try-in: equipment",
"body": "anterior try-in: equipment\n    ●​ from sterilization: exam kit, waxing kit, lab handpiece, lab burs, Fox plane, occlusal plane, Hanau torch, patient goggles,\n         blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, stone spatula, hot plate, trial dentures & articulator\n    ●​ in clinic: Thompson stick, extra-hard baseplate wax\n    ●​ in unit: matches, tongue depressor"
},
{
"id": "c049.14",
"section": "DENTURES",
"title": "DENTURE STEPS — anterior try-in: steps",
"body": "anterior try-in: steps\n    1.​ before the appointment\n              ○​ get your anterior setup approved by an instructor (1-2 days before appointment)\n              ○​ tell the patient the next appointment will be long & boring and have them bring something to do/read\n    2.​ get a start check\n    3.​ verify mounting & VDR\n              ○​ try in maxillary & mandibular dentures → have pt close to CR\n              ○​ relationship between maxillary & mandibular dentures should be identical in pt’s mouth as it is on the articulator\n              ○​ if relationship is not identical, you will need to retake bite registration & remount\n              ○​ verify that VDR = VDO + 2 mm\n                        ○​ use a marker to make a dot on the tip of the patient’s nose & the tip of the chin\n                        ○​ ways to get patient to VDR:\n                                ■​ the “M” sound indicates lip position at rest — have the patient say “M,” “mom” or “mob”\n                                ■​ have the patient lick their lips & swallow\n                                ■​ have patient slowly close jaw until lips touch\n                        ○​ use a ruler to measure the distance between the 2 dots when the patient is at VDR\n                                ■​ have patient sit up naturally (head not against head rest), as this affects the position of the jaws\n                        ○​ have patient close from VDR to VDO — there should be a 1-2 mm close\n                        ○​ evaluate: have the patient say “Emma” and “Mississippi” → maxillary & mandibular anterior teeth & wax\n                            rims should not touch\n                                ■​ when saying sibilant sounds (Mississippi), 1 mm of distance between wax rims is ideal\n                        ○​ you can use a tongue depressor to mark & measure VDR and VDO\n    4.​ evaluate incisal display\n              ○​ incisal display based on lip length (measure lip length from base of nose to edge of upper lip)\n                     lip length    incisal display\n                   10 - 20 mm       3 - 4 mm\n                   20 - 25 mm         2 mm\n                   25 - 30 mm         1 mm\n                   30 + mm           0 mm\n             ○​ incisal display based on age & gender\n                                       incisal display\n                       age            male          female\n                     < 45 yr         1 mm            2 mm\n                    45 - 65 yr       0 mm            1 mm\n                     65 + yr        – 1 mm          0 mm\n    5.​ evaluate incisal edge position, phonetics, & lip support\n            ○​ have the patient say “fifty five” → incisal edge of maxillary wax rim should contact vermillion border of lower lip\n            ○​ have the patient say “E” → maxillary incisal edge should be halfway between the upper & lower lip\n            ○​ evaluate lip support — does the patient look too full? does the patient look collapsed?\n                      ○​ in general, women have less lip support (larger nasolabial angle) than men\n                      ○​ the vermillion border of both lips should be visible when the patient is closed\n            ○​ evaluate buccal corridors (buccal extension)\n            ○​ anterior teeth should mirror the curvature of the lip in a smile\n            ○​ occlusal plane should be parallel to interpupillary line & not crooked\n            ○​ when saying sibilant sounds (“Mississippi”), maxillary & mandibular incisal edges should be edge to edge (no\n                 overjet) but should have ~1 mm space separation (should not be touching)\n            ○​ problems with phonetics may arise from convex denture base — base should be concave & mimic tissue contours\n\n    6.​ evaluate midline\n            ○​ make sure pt approves midline (both maxillary & mandibular) — get verbal confirmation from the patient\n    7.​ check in — have instructor confirm setup\n    8.​ complete codes & note\n            ○​ D5000NC (In-Process Step or PO Removable) for both upper arch & lower arch\n    9.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c049.15",
"section": "DENTURES",
"title": "DENTURE STEPS — anterior try-in: note template",
"body": "anterior try-in: note template\n - y/o female patient presents to Vivaldi clinic for F/F anterior try-in\n - medical history:\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F anterior try-in:\n - Verified VDR, VDO, & mounting.\n - Evaluated midline, incisal edge position, & occlusal plane and adjusted to ideal.\n - Evaluated lip support and adjusted to ideal.\n - Evaluated fricative & sibilant sounds and adjusted dentures to produce ideal phonetics.\n - Confirmed posterior palatal seal.\n - Evaluated tooth shape, shade, & positioning. Pt expressed satisfaction with esthetics.\n\n - NV: posterior/final wax try-in"
},
{
"id": "c049.17",
"section": "DENTURES",
"title": "DENTURE STEPS — anterior try-in: equipment",
"body": "anterior try-in: equipment\n    ●​ from sterilization: exam kit, waxing kit, lab handpiece, lab burs, Fox plane, occlusal plane, Hanau torch, patient goggles,\n         blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, stone spatula, hot plate, trial dentures & articulator\n    ●​ in clinic: Thompson stick, extra-hard baseplate wax\n    ●​ in unit: matches, tongue depressor"
},
{
"id": "c049.18",
"section": "DENTURES",
"title": "DENTURE STEPS — anterior try-in: steps",
"body": "anterior try-in: steps\n    1.​ before the appointment\n              ○​ get your anterior setup approved by an instructor (1-2 days before appointment)\n              ○​ tell the patient the next appointment will be long & boring and have them bring something to do/read\n    2.​ get a start check\n    3.​ RE-CHECK FROM LAST TIME\n              ○​ verify mounting & VDR\n                       ○​ try in maxillary & mandibular dentures → have pt close to CR\n                       ○​ relationship between maxillary & mandibular dentures should be identical in pt’s mouth as it is on the\n                           articulator\n                       ○​ if relationship is not identical, you will need to retake bite registration & remount\n                       ○​ verify that VDR = VDO + 2 mm\n                                ■​ use a marker to make a dot on the tip of the patient’s nose & the tip of the chin\n                                ■​ ways to get patient to VDR:\n                                          ●​ the “M” sound indicates lip position at rest — have the patient say “M,” “mom” or\n                                              “mob”\n                                          ●​ have the patient lick their lips & swallow\n                                          ●​ have patient slowly close jaw until lips touch\n                                ■​ use a ruler to measure the distance between the 2 dots when the patient is at VDR\n                                          ●​ when measuring VDR, have the patient sit up naturally (head not against head rest), as\n                                              this affects the position of the jaws\n                                ■​ have patient close from VDR to VDO — there should be a 1-2 mm close\n                                ■​ evaluate: have the patient say “Emma” and “Mississippi” → maxillary & mandibular anterior\n                                     teeth & wax rims should not touch\n                                          ●​ when saying sibilant sounds (Mississippi), 1 mm of distance between wax rims is ideal\n                                ■​ you can use a tongue depressor to mark & measure VDR and VDO\n              ○​ evaluate incisal display\n                       ○​ incisal display based on lip length (measure lip length from base of nose to edge of upper lip)\n                               lip length      incisal display\n                             10 - 20 mm         3 - 4 mm\n                             20 - 25 mm           2 mm\n                             25 - 30 mm           1 mm\n                              30 + mm            0 mm\n                      ○​ incisal display based on age & gender\n                                                incisal display\n                                age           male           female\n                               < 45 yr        1 mm           2 mm\n                             45 - 65 yr       0 mm           1 mm\n                             65 + yr        – 1 mm          0 mm\n             ○​ evaluate incisal edge position, phonetics, & lip support\n                    ○​ have the patient say “fifty five” → incisal edge of maxillary wax rim should contact vermillion border of\n                         lower lip\n                    ○​ have the patient say “E” → maxillary incisal edge should be halfway between the upper & lower lip\n                    ○​ evaluate lip support — does the patient look too full? does the patient look collapsed?\n                              ■​ in general, women have less lip support (larger nasolabial angle) than men\n                              ■​ the vermillion border of both lips should be visible when the patient is closed\n                    ○​ evaluate buccal corridors (buccal extension)\n\n                          ○​ anterior teeth should mirror the curvature of the lip in a smile\n                          ○​ occlusal plane should be appropriately canted\n                          ○​ when saying sibilant sounds (“Mississippi”), maxillary & mandibular incisal edges should be edge to edge\n                               (no overjet) but should have ~1 mm space separation (should not be touching)\n                          ○​ problems with phonetics may arise from convex denture base — the denture base should be concave &\n                               mimic the contours of the tissue\n                ○​ evaluate midline\n                          ○​ make sure pt approves midline (both maxillary & mandibular)\n    4.​   evaluate occlusal contacts\n                ○​ use horseshoe articulating paper to mark centric contacts\n                          ○​ there must be at least posterior 2 teeth on each side with tight contacts\n                ○​ use the opposite side (color) horseshoe articulating paper to mark lateral & protrusive contacts\n                          ○​ there must be at least posterior 2 teeth on each side in contact during lateral movement\n                          ○​ there must be at least 1 anterior contact + 1 posterior contact on each side in contact during protrusion\n    5.​   check in — have instructor verify posterior setup\n    6.​    !!!!!!!!!! have pt sign consent form !!!!!!!!!!\n                ○​ obtain pt approval for all aspects of the denture\n                          ○​ ask pt about tooth color, tooth shape, tooth position, midline\n                          ○​ confirm that there is absolutely nothing the pt wants you to change — this is the last chance!\n                ○​ have the patient sign the denture consent form\n                          ○​ plug in signature pad\n                          ○​ click consent icon → click “Add Patient Consent…”\n                          ○​ next to “Consent,” select “DENTUR”\n                          ○​ print the denture consent form (optional, but easier to show patient)\n                          ○​ go over everything with the pt out loud\n                          ○​ have pt sign\n    7.​   complete codes & note\n                ○​ D5110B (Wax Tryin)\n                ○​ D5120B (Wax Tryin)\n    8.​   check in — have instructor swipe EPR/codes/note"
},
{
"id": "c049.19",
"section": "DENTURES",
"title": "DENTURE STEPS — posterior try-in: note template",
"body": "posterior try-in: note template\n - y/o female patient presents to Vivaldi clinic for F/F posterior/final wax try-in\n - medical history: RMH, no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F posterior (final) try-in:\n - Inserted F/F trial dentures and confirmed midline, incisal edge position, lip support, phonetics, esthetics, & occlusal plane. Adjusted to ideal.\n - Adjusted teeth to achieve ideal occlusal, lateral, & protrusive contacts.\n - Pt evaluated trial dentures using a mirror & expressed satisfaction with all aspects of denture. Confirmed size, shape, color, & positioning of\n anterior teeth.\n - Explained denture consent form & obtained pt’s signed consent.\n - Submitted wax trial dentures to lab for processing.\n\n - NV: F/F delivery"
},
{
"id": "c049.21",
"section": "DENTURES",
"title": "DENTURE STEPS — denture delivery: equipment",
"body": "denture delivery: equipment\n    ●​ from sterilization: exam kit, lab handpiece, lab burs, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, dentures from the lab, articulator\n    ●​ in clinic: horseshoe articulating paper, PIP, PIP remover, Thompson stick, disclosing wax"
},
{
"id": "c049.22",
"section": "DENTURES",
"title": "DENTURE STEPS — denture delivery: steps",
"body": "denture delivery: steps\n    1.​ get a start check\n    2.​ check denture fit & esthetics\n             ○​ before putting dentures in mouth, check denture for any sharp/rough spots & adjust\n             ○​ insert dentures\n             ○​ ask pt if they notice any immediate areas of concern (pain, sharp, tight, etc.)\n             ○​ give pt hand mirror & ask if they approve of esthetics (be encouraging & positive)\n    3.​ check posterior palatal seal\n             ○​ with the dentures out of the mouth, have the pt say “Ah” & use a wet Thompson stick to mark the vibrating line\n             ○​ insert the dentures and determine the extension past the vibrating line\n             ○​ reduce any palatal overextension with a bur, then bevel the reduction to create a gradual slope toward the\n                  posterior border of the denture (feather edge)\n    4.​ check border extension\n             ○​ gently pull on the patient’s cheeks, have them lift their tongue up slightly — denture should not move\n             ○​ run finger along denture border to make sure it is not impinging on tissues / overextended\n    5.​ PIP paste\n             ○​ ask instructor if they want you to use PIP paste; some do, some don’t\n             ○​ thoroughly dry the denture\n             ○​ open the PIP foil packet & use the included brush to apply the PIP to the intaglio of the denture\n                      ■​ the PIP should be applied in a thin layer so that brush strokes are visible; a thick layer will not work\n                      ■​ brush in the same direction so it’s easier to determine show-through later\n             ○​ (optional) spray Mizzy spray in patient’s mouth on residual ridge\n                      ■​ Mizzy spray prevents PIP from sticking to patient’s mucosa\n                      ■​ you do not want a dry mouth — the PIP will stick to the mouth\n                      ■​ if patient has lots of ropy saliva: spray Mizzy spray in mouth → have pt swish → suction\n             ○​ insert the denture into the patient’s mouth with their help\n                      ■​ do not apply firm pressure! do not have the patient bite! only apply light hand pressure on 1st molars\n             ○​ leave the denture in the mouth for ~5 seconds → remove the denture from the mouth\n             ○​ examine the denture for areas of show-through (high areas)\n                      ■​ if there are tons of areas of show-through, you applied too much pressure or left the denture in the mouth\n                           too long — clean off the denture, re-apply PIP, re-apply Mizzy spray, & repeat\n             ○​ leave the PIP on the denture — do not clean yet\n             ○​ use lab burs to reduce high spots / show through spots\n             ○​ after adjusting, add more PIP to the adjusted area so that the entire denture is covered in PIP again\n             ○​ repeat the PIP multiple times! until denture is ideal without high spots\n             ○​ you can also use PIP paste to evaluate only a specific area of concern — apply only to this area & adjust as needed\n    6.​ check occlusion\n             ○​ use horseshoe articulating paper to mark occlusion, lateral movements, & protrusion\n             ○​ use lab bur to reduce denture teeth that are hitting too high\n             ○​ re-evaluate & repeat\n             ○​ goals:\n                      ■​ even contact on both sides of the denture on multiple/all posterior teeth\n                      ■​ in protrusion: 2 posterior contacts (1 on each side) and anterior contact\n             ○​ it is most useful to pick one arch, and adjust the teeth that arch only\n    7.​ check in — have instructor check adjustments\n    8.​ polish denture\n             ○​ polish the denture in lab with rag wheel + pumice in the support lab\n             ○​ only polish the outside; do not polish the intaglio\n    9.​ complete codes & note\n             ○​ D5110C (Delivery)\n             ○​ D5120C (Delivery)\n             ○​ I9002 (Lab quality review)\n\n    10.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c049.23",
"section": "DENTURES",
"title": "DENTURE STEPS — denture delivery: note template",
"body": "denture delivery: note template\n - y/o female patient presents to Vivaldi clinic for F/F delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F delivery:\n - F/F tried in. Pt approves of esthetics & reports that dentures feel comfortable, no areas of immediate concern.\n - Evaluated F/F intaglio with PIP paste. No adjustment needed at this time. / Adjusted intaglio with burs accordingly.\n - Evaluated occlusion with horseshoe articulating paper. F/F show balanced occlusion, bilateral balanced articulation, & contact in protrusion; no\n adjustments needed at this time. / Adjusted teeth to achieve balanced occlusion, bilateral balanced articulation, & contact in protrusion.\n - F/F polished with rag wheel & pumice.\n - Post-delivery instructions printed for pt & reviewed verbally. Gave pt denture toothbrush, box, polident, polygrip. Pt instructed not to remove\n dentures until 24 hr followup tomorrow. Pt understands.\n\n NV: 24 hr post-delivery followup"
},
{
"id": "c049.25",
"section": "DENTURES",
"title": "DENTURE STEPS — denture adjustment: equipment",
"body": "denture adjustment: equipment\n    ●​ from sterilization: exam kit, lab handpiece, lab burs, patient goggles, blood glucose kit\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, Hanau torch (full)\n    ●​ in clinic: horseshoe articulating paper, PIP, PIP remover, Thompson stick, disclosing wax\n    ●​ in unit: cotton-tipped applicators"
},
{
"id": "c049.26",
"section": "DENTURES",
"title": "DENTURE STEPS — denture adjustment: steps",
"body": "denture adjustment: steps\n    1.​ get a start check\n    2.​ IOE\n             ○​ interview pt to see how they feel (sore spots?)\n             ○​ have patient take dentures out & perform intraoral exam\n             ○​ note any sore spots or other problems\n             ○​ !!! palpate the entire maxillary & mandibular ridges to see if pt is sore anywhere; sometimes pt will be sore without\n                  any evidence of sore spot\n    3.​ use Thompson stick to check sore spots\n             ○​ locate the sore spot\n             ○​ wet the Thompson stick & mark the sore spot with the Thompson stick — be gentle, as this can hurt the patient\n             ○​ keep the cheeks retracted so the ink doesn’t transfer anywhere\n             ○​ gently insert the denture into the mouth\n             ○​ leave the denture in the mouth for ~5 seconds\n             ○​ gently remove the denture from the mouth\n             ○​ examine the denture to see where the sore spot is\n             ○​ reduce the denture intaglio with lab burs\n    4.​ PIP paste\n             ○​ thoroughly dry the denture\n             ○​ open the PIP foil packet & use the included brush to apply the PIP to the intaglio of the denture\n                      ■​ the PIP should be applied in a thin layer so that brush strokes are visible; a thick layer will not work\n                      ■​ brush in the same direction so it’s easier to determine show-through later\n             ○​ (optional) spray Mizzy spray in patient’s mouth on residual ridge\n                      ■​ Mizzy spray prevents PIP from sticking to patient’s mucosa\n                      ■​ you do not want a dry mouth — the PIP will stick to the mouth\n                      ■​ if patient has lots of ropy saliva: spray Mizzy spray in mouth → have pt swish → suction\n             ○​ insert the denture into the patient’s mouth with their help\n                      ■​ do not apply firm pressure! do not have the patient bite! only apply light hand pressure on 1st molars\n             ○​ leave the denture in the mouth for ~5 seconds\n             ○​ remove the denture from the mouth\n             ○​ examine the denture for areas of show-through (high areas)\n                      ■​ if there are tons of areas of show-through, you applied too much pressure or left the denture in the mouth\n                          too long — clean off the denture, re-apply PIP, re-apply Mizzy spray, & repeat\n             ○​ leave the PIP on the denture — do not clean yet\n             ○​ use lab burs to reduce high spots / show through spots\n             ○​ after adjusting, add more PIP to the adjusted area so that the entire denture is covered in PIP again\n             ○​ repeat the PIP multiple times! until denture is ideal without high spots\n             ○​ if patient has specific areas that feel sore:\n                      ■​ dry denture & apply PIP to the area of complaint\n                      ■​ insert denture & have patient do whatever makes it sore (opening mouth wide, move your cheeks, etc.)\n             ○​ spray dentures with PIP remover and let sit; use gauze, cotton-tipped applicators, water to remove PIP\n    5.​ use disclosing wax to check denture borders\n             ○​ roll up some disclosing wax into tiny ropes\n             ○​ apply & mold the ropes of disclosing wax to the denture borders\n             ○​ disclosing wax should be no more than 2 mm thick surrounding the denture borders\n             ○​ insert the denture into the mouth with the patient’s help\n             ○​ have patient undergo border molding movements & use your hands to manipulate their cheeks\n             ○​ remove the denture from the mouth with the patient’s help\n             ○​ examine the denture for areas of show-through (high areas)\n             ○​ leave the disclosing wax on the denture — do not clean yt\n             ○​ use lab burs to reduce high spots / show through spots\n\n                ○​ after adjusting, add more disclosing wax to the adjusted area so that the entire denture is covered in disclosing wax\n                     again\n                ○​ repeat the disclosing wax multiple times! until denture is ideal without high spots\n       6.​ check posterior palatal extension\n                ○​ with the dentures out of the mouth, have the pt say “Ah” & use a wet Thompson stick to mark the vibrating line\n                ○​ insert the dentures and determine the extension past the vibrating line\n                ○​ reduce any palatal overextension with a bur, then bevel the reduction to create a gradual slope toward the\n                     posterior border of the denture (feather edge)\n       7.​ check border extension\n                ○​ gently pull on the patient’s cheeks, have them lift their tongue up slightly — denture should not move\n                ○​ run finger along denture border to make sure it is not impinging on tissues / overextended\n       8.​ check occlusion\n                ○​ usually at the 24 hour followup, you don’t adjust occlusion too much because the pt still needs to get adjusted to\n                     the denture & the intaglio will likely need a decent amount of adjustment\n                ○​ use horseshoe articulating paper to mark occlusion\n                ○​ use lab bur to reduce denture teeth that are hitting too high\n                ○​ re-evaluate & repeat\n                ○​ goals:\n                         ■​ even contact on both sides of the denture on multiple/all posterior teeth\n                         ■​ in protrusion: 2 posterior contacts (1 on each side) and anterior contact\n       9.​ polish denture\n                ○​ polish the denture in lab with rag wheel + pumice in the support lab\n                ○​ only polish the outside; do not polish the intaglio\n       10.​ complete codes & note\n                ○​ D5455 (Post Insertion Adjustment - N/C)\n                ○​ or you can use code D5000NC (In-Process Step or PO Removable) for which ever arch you adjusted (complete 2\n                     codes if you adjusted both arches)\n       11.​ check in\n                ○​ have your instructor swipe your EPR/codes/note"
},
{
"id": "c049.27",
"section": "DENTURES",
"title": "DENTURE STEPS — denture adjustment: note template",
"body": "denture adjustment: note template\n - y/o female patient presents to Vivaldi clinic for F/F adjustment\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/F adjustment:\n — CC: “.” Pt reports that .\n — IOE reveals .\n — Sore spot on buccal of anterior mandibular residual ridge marked with Thompson stick, transferred, & intaglio adjusted accordingly.\n — Applied PIP; evaluated & adjusted intaglio to relieve areas of excessive pressure.\n — Evaluated occlusion with horseshoe articulating paper; adjusted denture teeth accordingly. Repeated to achieve bilaterally balanced occlusion.\n — F/F polished with rag wheel & pumice.\n\n Pt reports improvement & is satisfied. Advised pt that sore spots will still feel tender even with denture adjustment and will take a few days to\n heal.\n\n NV:"
},
{
"id": "c050.0",
"section": "DENTURES",
"title": "LAB RELINE — lab reline: equipment",
"body": "lab reline: equipment\n     ●​ from sterilization: fixed prosth kit (you will use spatula), lab handpiece, lab burs, PVS gun, gingival shade guide, patient\n         goggles, blood glucose kit\n     ●​ from locker: blood pressure cuff, loupes and/or eye protection, Hanau torch (full)\n     ●​ in clinic: horseshoe articulating paper, PIP, PIP remover, Thompson stick, light body PVS + tips (2) , PVS adhesive + dappen\n         dish + brushes\n     ●​ in unit: cotton-tipped applicators"
},
{
"id": "c050.1",
"section": "DENTURES",
"title": "LAB RELINE — lab reline: steps",
"body": "lab reline: steps\n     1.​ before the appointment:\n               ○​ if the pt has an old denture (like an immediate), tell them to bring it to the appointment because you’ll be sending\n                   their current denture to the lab for 2 weeks\n     2.​ get a start check\n     3.​ evaluate & adjust denture\n               ○​ see above — DENTURE #7: ADJUSTMENT\n               ○​ CC / IOE / palpate\n               ○​ Thomson stick / PIP paste\n               ○​ posterior palatal seal\n               ○​ border extension\n               ○​ occlusion\n     4.​ clean the denture\n               ○​ thoroughly clean the denture\n               ○​ if the denture is really gross, place it in the ultrasonic machine in the support lab\n     5.​ orient the denture\n               ○​ try the denture into the pt’s mouth; note how the denture fits (incisal display, orientation, etc.) — you need to\n                   position the denture in the correct position when taking the impression, as mis-orientation will alter the pt’s VDO,\n                   phonetics, etc.\n     6.​ relieve the denture intaglio\n               ○​ use lab burs to remove 0.5 mm of intaglio uniformly\n     7.​ shorten the flanges\n               ○​ reduce the flanges by 1 mm uniformly\n     8.​ place relief holes\n               ○​ place a singular relief hole in the center of the palate for the maxillary denture\n               ○​ no relief hole for mandibular dentures\n     9.​ take impression\n               ○​ load a very thin (1-2 mm) layer of light body into the denture; use the mixing spatula to roll the light body up &\n                   over the flanges\n               ○​ seat the denture in the correct orientation\n               ○​ have patient bite down\n               ○​ border mold\n     10.​ confirm gingival shade\n               ○​ check original lab script for the gingival shade used to fabricate the denture\n               ○​ if you can’t find the shade, use the gingival shade guide to match as close as possible\n     11.​ complete codes & note\n               ○​ D5750 (Reline comp max - laboratory)\n     12.​ send impression & lab script to lab\n     13.​ check in\n               ○​ have your instructor swipe your EPR/codes/note"
},
{
"id": "c050.2",
"section": "DENTURES",
"title": "LAB RELINE — lab reline: note template",
"body": "lab reline: note template\n - y/o female patient presents to Vivaldi clinic for F/ lab reline\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n F/ adjustment\n — CC: “.” Pt reports that .\n — IOE reveals .\n — Sore spot on buccal of anterior mandibular residual ridge marked with Thompson stick, transferred, & intaglio adjusted accordingly.\n — Applied PIP; evaluated & adjusted intaglio to relieve areas of excessive pressure.\n — Evaluated occlusion with horseshoe articulating paper; adjusted denture teeth accordingly. Repeated to achieve bilaterally balanced occlusion.\n\n Verified VDO, overjet, overbite, occlusion, articulation. F/ is ready for reline.\n\n F/ lab reline\n — F/ intaglio relieved with lab bur by 0.5 mm.\n — Drilled relief hold in F/ palate.\n — Took impression with light-body PVS against natural dentition in CR. Verified correct placement — midline & VDO are correct.\n — Denture impression sent to lab.\n\n Informed pt that F/ will be sent to lab. Instructed pt to use interim immediate F/ in the meantime. Adjusted interim immediate F/ so that pt is\n comfortable using it. Advised soft diet.\n\n NV: F/ delivery post-lab-reline"
},
{
"id": "c050.3",
"section": "DENTURES",
"title": "LAB RELINE — lab script example: lab reline",
"body": "lab script example: lab reline\n F/: Please reline the denture with heat-cured acrylic resin, shade L199-OR. Please add the posterior palatal seal as indicated on the impression.\n Please polish and return for delivery. Thank you."
},
{
"id": "c051.0",
"section": "IMPLANT",
"title": "IMPLANT-LEVEL IMPRESSION — implant-level impression: equipment",
"body": "implant-level impression: equipment\n    ●​ from sterilization: restorative kit, radiograph kit, vertical bitewings, impression guns (2)\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, alginate mixing bowl, spatula\n    ●​ in clinic: impression trays (top & bottom), PVS adhesive + dappen dish + brushes, medium body PVS + tips, heavy body PVS +\n        tips, alginate, water cylinder, alginate spray adhesive, Regisil + tip\n             ○​ from Chicago office: implant kit, impression coping, implant replica, e.max shade guide\n    ●​ in unit: floss"
},
{
"id": "c051.1",
"section": "IMPLANT",
"title": "IMPLANT-LEVEL IMPRESSION — implant-level impression: steps",
"body": "implant-level impression: steps\n    1.​ before seating pt: get implant instruments\n             ○​ check the pt’s chart for the surgical note that lists the brand & size of the implants placed\n             ○​ go to the implant office → tell the Chicago assistant the brand & size of implants → ask for impression coping +\n                  implant replica + implant kit + e.max shade guide\n    2.​ before seating pt: apply adhesive to impression trays\n             ○​ size the appropriate impression trays (use diagnostic casts to size)\n             ○​ apply adhesive USING A CLEAN BRUSH EVERY TIME OR USING A DAPPEN DISH — brushes that touch the tray are\n                  contaminated with pt’s saliva; double dipping in the bottle contaminates all the adhesive\n             ○​ only apply a thin layer of adhesive (if adhesive pools or drips, there’s too much) — don’t double dip the brush\n             ○​ allow the adhesive to dry (can take 5 min)\n             ○​ apply alginate spray adhesive to opposing arch (for alginate impression)\n    3.​ seat pt & get a start check\n    4.​ evaluate tissue\n             ○​ evaluate the health of the tissue surrounding the healing abutment\n             ○​ evaluate restorative space and determine need for opposing tooth enameloplasty\n    5.​ select a shade\n             ○​ select a shade for the final crown\n             ○​ use overhead light, ambient light, & natural light\n    6.​ remove healing abutment\n             ○​ place a gauze throat pack\n             ○​ attach floss to the hand driver\n             ○​ use the hand driver to unscrew the healing abutment (lefty loosey)\n    7.​ place impression coping\n             ○​ use your hand to screw in the impression coping; after it’s mostly screwed in, gently\n                  tighten with the hand driver\n    8.​ take a vertical bitewing\n             ○​ take a vertical bitewing bitewing (ask your instructor if they prefer vertical bitewing\n                  or PA) of the impression coping to verify full seating (see images)\n    9.​ check in — show instructor impression coping placement & PA\n    10.​ take impression / scan\n             ○​ at UIC, we do closed-tray impressions; once you’ve taken 1 conventional PVS\n                  impression, your next implant you will scan digitally instead\n             ○​ for Straumann implants: snap on the impression coping cap in the buccolingual\n                  direction\n             ○​ warn your patient how awful this final impression is going to be; explain/show how\n                  to put their chin down, give them paper towels, get suction ready\n             ○​ you’ll need someone to help you (instructor, another student, assistant)\n             ○​ have your assistant load the tray with heavy body PVS\n             ○​ thoroughly dry the impression coping & adjacent teeth with the air/water syringe\n             ○​ use the micro-tip to apply medium body PVS into the gingival sulcus around the\n                  impression coping\n             ○​ seat the tray loaded with heavy-body\n             ○​ allow the full 6 minutes to set (set a timer)\n             ○​ remove impression\n    11.​ check in — show instructor your impression / digital scan\n    12.​ remove impression coping / replace healing abutment\n             ○​ unscrew & remove impression coping\n             ○​ use hand driver to replace healing abutment; do not over-tighten\n\n    13.​ check in — have instructor ensure healing abutment is properly placed\n    14.​ take alginate impression of opposing arch + bite registration\n             ○​ take impressions at very end of appointment, you need to pour them within 15 minutes of taking them\n             ○​ take bite registration with Regisil\n    15.​ dismiss pt\n    16.​ complete codes & note\n             ○​ DD6057A (Digital Custom Abutment -- Initial Preparation)\n             ○​ DD6057B (Digital Custom Abutment -- Scan & Design)\n             ○​ D0275 (Bitewing N/C)\n    17.​ check in — have instructor swipe EPR/codes/note\n    18.​ pour your impression (below) + send lab script"
},
{
"id": "c051.2",
"section": "IMPLANT",
"title": "IMPLANT-LEVEL IMPRESSION — implant-level impression: note template",
"body": "implant-level impression: note template\n - y/o female patient presents to Chicago clinic for #13 STI implant-level impression\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI implant-level impression:\n\n Tissue surrounding #13 healing abutment is healthy and without signs of inflammation. Restorative space is adequate to proceed without\n enameloplasty.\n\n Attached floss to hand-driver and placed gauze throat pack. Removed healing abutment with hand driver. Tightened closed-tray impression coping\n onto intraoral implant with hand driver. Took BW to verify seating. Achieved good isolation & took closed-tray final impression using heavy body\n PVS & medium body PVS. Removed impression coping and replaced healing abutment with hand driver.\n\n Selected shade A2 for #13 STI crown. Pt used hand mirror & confirmed shade verbally.\n\n Took alginate impression of lower arch. Took bite registration with Regisil.\n\n NV:"
},
{
"id": "c051.3",
"section": "IMPLANT",
"title": "IMPLANT-LEVEL IMPRESSION — pouring your impression",
"body": "pouring your impression\n    1.​ attach impression coping to implant replica\n    2.​ seat the impression coping / implant replica into the impression\n    3.​ apply a light coat of vaseline to the PVS & gingival third of the implant replica\n    4.​ apply soft tissue moulage around gingival third of implant replica\n    5.​ allow soft tissue moulage to set; use microbrush to prevent seepage into adjacent teeth\n    6.​ pour impression in Silky Rock stone (Type IV stone)\n    7.​ trim the cast\n    8.​ remove the impression coping\n    9.​ mount the casts (make sure the master cast & diagnostic casts are both mounted the same way)\n    10.​ send a lab script for the custom abutment\n\nlab script example: custom abutment for implant\n Please fabricate a Straumann custom abutment for #13.\n Implant: Straumann brand, diameter 3.6 mm.\n Abutment type: Titanium\n Emergence profile: Default\n Planned crown type: cement-retained, all-ceramic e.max CAD/CAM crown\n\nsupplements: soft tissue working cast, opposing cast, diagnostic cast"
},
{
"id": "c052.0",
"section": "IMPLANT",
"title": "CUSTOM ABUTMENT TRY-IN — abutment try-in: equipment",
"body": "abutment try-in: equipment\n    ●​ from sterilization: restorative kit, radiograph kit, vertical bitewings\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, abutment from lab\n    ●​ from Chicago office: implant kit, e.max shade guide\n    ●​ in unit: floss"
},
{
"id": "c052.1",
"section": "IMPLANT",
"title": "CUSTOM ABUTMENT TRY-IN — abutment try-in: steps",
"body": "abutment try-in: steps\n    1.​ before seating pt: get implant instruments\n            ○​ check the pt’s chart for the surgical note that lists the brand of the implants placed\n            ○​ go to the implant office → tell the Chicago assistant the brand of implant → ask for implant kit + e.max shade\n                 guide\n    2.​ seat pt & get a start check\n    3.​ evaluate tissue\n            ○​ evaluate the health of the tissue surrounding the healing abutment\n            ○​ evaluate restorative space and determine need for opposing tooth enameloplasty\n    4.​ confirm shade selection\n            ○​ you should’ve selected a shade last time, but if not, do it today\n            ○​ confirm the shade chosen last time\n            ○​ use overhead light, ambient light, & natural light\n            ○​ have the patient confirm with a mirror\n    5.​ remove healing abutment\n            ○​ place a gauze throat pack\n            ○​ attach floss to the hand driver\n            ○​ use the hand driver to unscrew the healing abutment (lefty loosey)\n    6.​ place custom abutment\n            ○​ check the orientation of the custom abutment on the cast to make sure you know which way it goes in\n            ○​ use the hand driver to screw in the custom abutment — the pt’s tissue may be sensitive, so tighten slowly\n    7.​ take a vertical bitewing\n            ○​ take a vertical bitewing bitewing (ask your instructor if they prefer vertical bitewing or PA) of the custom abutment\n                 to verify full seating (see images)\n\n    8.​ evaluate custom abutment\n             ○​ evaluate custom abutment for:\n                     ■​ interocclusal space — at least 2 mm\n                     ■​ location & width of finish line\n                     ■​ axial reduction, taper, & path of draw\n    9.​ check in — show instructor custom abutment placement & BW\n    10.​ remove custom abutment / replace healing abutment\n             ○​ unscrew & remove custom abutment\n             ○​ use hand driver to replace healing abutment; do not over-tighten\n    11.​ check in — have instructor ensure healing abutment is properly placed\n    12.​ dismiss pt\n    13.​ complete codes & note\n\n             ○​ DD6058A (Digital- All porcelain/ceramic crown on abutment -- Initial Preparation)\n             ○​ DD6058B (Digital- All porcelain/ceramic crown on abutment -- Scan & Design)\n             ○​ D0275 (Bitewing N/C)\n    14.​ check in — have instructor swipe EPR/codes/note\n    15.​ send lab script"
},
{
"id": "c052.2",
"section": "IMPLANT",
"title": "CUSTOM ABUTMENT TRY-IN — abutment try-in: note template",
"body": "abutment try-in: note template\n - y/o female patient presents to Chicago clinic for #13 STI custom abutment try-in\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI custom abutment try-in:\n\n Tissue surrounding #13 healing abutment is healthy and without signs of inflammation. Restorative space is adequate to proceed without\n enameloplasty.\n\n Attached floss to hand-driver and placed gauze throat pack. Removed healing abutment with hand driver. Tightened custom abutment onto\n intraoral implant with hand driver. Took BW to verify seating.\n\n Evaluated custom abutment for axial reduction, taper, path of draw, emergenc profile, margin location & width, adequate restorative space\n (mesiodistally, buccolingually, & occlusally). Custom abutment is ideal to proceed with crown fabrication.\n\n Removed custom abutment and replaced healing abutment with hand driver.\n\n Selected shade A2 for #13 STI crown at last visit, confirmed shade today. Pt used hand mirror & confirmed shade verbally.\n\n NV: #13 STI custom abutment & crow delivery\n\nlab script example: implant crown\n Please fabricate all-ceramic emax CAD/CAM crown (lithium disilicate) for site #14 (Dentsply EV 4.8mm): Shade LT A2. Please crystalize and return\n it for delivery. Thank you\n\nsupplements: soft tissue working cast, opposing cast, diagnostic cast"
},
{
"id": "c053.0",
"section": "IMPLANT",
"title": "IMPLANT CROWN DELIVERY — implant crown delivery: equipment",
"body": "implant crown delivery: equipment\n    ●​ from sterilization: restorative kit, radiograph kit, vertical bitewings, handpieces, e.max intraoral finishing burs, e.max\n        intraoral polishing burs\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection, abutment & crown from lab\n    ●​ from Chicago office: implant kit, implant replica, Panavia cement kit\n    ●​ in unit: floss, articulating paper, shimstock"
},
{
"id": "c053.1",
"section": "IMPLANT",
"title": "IMPLANT CROWN DELIVERY — implant crown delivery: steps",
"body": "implant crown delivery: steps\n    1.​ before seating pt: get implant instruments\n            ○​ check the pt’s chart for the surgical note that lists the brand of the implants placed\n            ○​ go to the implant office → tell the Chicago assistant the brand of implant → ask for implant kit + implant replica\n    2.​ seat pt & get a start check\n    3.​ evaluate tissue\n            ○​ evaluate the health of the tissue surrounding the healing abutment\n            ○​ evaluate restorative space and determine need for opposing tooth enameloplasty\n    4.​ remove healing abutment\n            ○​ place a gauze throat pack\n            ○​ attach floss to the hand driver\n            ○​ use the hand driver to unscrew the healing abutment (lefty loosey)\n    5.​ place custom abutment\n            ○​ check the orientation of the custom abutment on the cast to make sure you know which way it goes in\n            ○​ use the hand driver to screw in the custom abutment — the pt’s tissue may be sensitive, so tighten slowly\n    6.​ take a vertical bitewing\n            ○​ take a vertical bitewing bitewing (ask your instructor if they prefer vertical bitewing or PA) of the custom abutment\n                 to verify full seating (see images)\n\n    7.​ evaluate custom abutment\n             ○​ evaluate custom abutment for:\n                       ■​ interocclusal space — at least 2 mm\n                       ■​ location & width of finish line\n                       ■​ axial reduction, taper, & path of draw\n    8.​ check in — show instructor custom abutment placement & BW\n    9.​ try crown on\n             ○​ place gauze as a throat pack to catch the crown if it falls off\n             ○​ use floss to evaluate interproximal contacts — hold the crown with your finger so you don’t dislodge it\n             ○​ evaluate margins with an explorer\n    10.​ adjust the crown as needed\n             ○​ adjust interproximal contacts first\n                       ■​ the most common cause for a crown failing to seat all the way is too tight of interproximal contacts\n                       ■​ mark the interproximal contacts with articulating paper → adjust crown with burs → see if crown fits now\n             ○​ next, adjust margins\n             ○​ after interproximal contacts & margins are ideal, adjust occlusion\n    11.​ adjust occlusion\n\n                 ○​ use articulating paper to evaluate occlusion\n                          ■​ sometimes articulating paper doesn’t show up on ceramic very well — lightly coat the articulating paper\n                               with vaseline to help the markings show\n                 ○​ use ceramic burs to adjust occlusion now before cementation (adjust extraorally or intraorally)\n       12.​ evaluate esthetics\n                 ○​ ask patient if they are happy with esthetics — shape, size, & color\n       13.​ take bitewing\n                 ○​ take a bitewing to verify full seating & closed margins (before cementation)\n                 ○​ no need to take radiographs for anterior teeth\n       14.​ check in — cement crown / torque abutment\n                 ○​ cement using Panavia cement (see digital crown delivery for specific steps)\n                 ○​ for screw-cementable crowns:\n                          ■​ screw the custom abutment onto implant replica (use the implant replica as a “holder”)\n                          ■​ stuff screw hole with cotton pellet\n                          ■​ cement crown to custom abutment using Panavia cement (follow proper sequence for implant crowns)\n                          ■​ clean excess cement from screw hole with explorer\n                          ■​ light cure cement\n                          ■​ remove cotton pellet (try using explorer or spoon excavator)\n                          ■​ torque the abutment/crown: the instructor torques the abutment/crown\n                                   ○​ Astra abutments are torqued to 25 Ncm\n                                   ○​ Straumann abutments are torqued to 35 Ncm\n                          ■​ fill the screwhole with composite (etch, bond, etc. — the usual composite technique)\n       15.​ verify margins, interproximal contacts, & occlusion\n                 ○​ verify margins\n                 ○​ verify interproximal contacts with floss\n                 ○​ use articulating paper to verify occlusal contacts & excursive contacts — adjust to ideal with burs\n       16.​ polish crown\n                 ○​ if you adjusted crown at all, use intraoral ceramic polishing burs in correct sequence to finish the crown\n       17.​ give post-op instructions & dismiss pt\n                 ○​ no sticky foods for 24 hours; call if bite feels uneven or if pain\n       18.​ complete codes & note\n                 ○​ DD6058A (Digital- All porcelain/ceramic crown on abutment -- Initial Preparation)\n                 ○​ DD6058B (Digital- All porcelain/ceramic crown on abutment -- Scan & Design)\n                 ○​ D0275 (Bitewing N/C)\n       19.​ check in — have instructor swipe EPR/codes/note\n       20.​ send lab script"
},
{
"id": "c053.2",
"section": "IMPLANT",
"title": "IMPLANT CROWN DELIVERY — implant crown delivery: note template",
"body": "implant crown delivery: note template\n - y/o female patient presents to Chicago clinic for #13 STI custom abutment & crown delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n #13 STI custom abutment & crown delivery:\n\n NV:"
},
{
"id": "c054.0",
"section": "DIGITAL",
"title": "DIGITAL PREP & SCAN — digital prep & scan: equipment",
"body": "digital prep & scan: equipment\n     ●​ from sterilization: fixed prosth kit, rubber dam kit, handpieces, fixed prosth burs, composite finishing burs, digital prep burs,\n          Integrity gun, composite gun, curing light, extraoral camera, cheek retractors + mirrors, Isodry, patient goggles, blood\n          glucose kit -- ask for extraoral provisional burs (they always forget them!)\n     ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n     ●​ from Chicago office: digital e.max shade guide, Telio (for inlays/onlays)\n     ●​ in clinic: articulating paper, microbrushes, Gluma, TempBond + mixing pad or UltraTemp + tips, cords + Hemodent + dappen\n          dish, Integrity + tip (for onlays, crowns), lab putty + activator\n     ●​ in unit: anesthetic needle/carpule/shield/topical, floss"
},
{
"id": "c054.1",
"section": "DIGITAL",
"title": "DIGITAL PREP & SCAN — digital prep & scan: steps",
"body": "digital prep & scan: steps\n     1.​ make 2 putties\n               ○​ before you bring in the patient, make 2 putties of the cast so you have a putty to use for provisionalization & a\n                   putty to use as a reduction guide\n     2.​ select a shade\n               ○​ select a shade for the final crown\n               ○​ use overhead light, ambient light, & natural light\n               ○​ the shade guide is with the assistant in the Chicago office\n               ○​ generally, high translucency is used for inlays & onlays, and low translucency is used for crowns\n     3.​ take photos\n     4.​ get a start check\n     5.​ check occlusion\n               ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                   adjacent teeth (or other teeth on that side)\n               ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                   occlusion (especially making sure occlusion on adjacent teeth is the same)\n     6.​ deliver local anesthetic\n     7.​ isolate\n               ○​ Dr. Rodriguez prefers you to use rubber dam isolation whenever possible\n               ○​ Isodry is OK in some situations, check with your instructor\n     8.​ complete prep\n               ○​ see the digital prep guidelines for inlays, onlays, & crowns\n     9.​ check in — have instructor check prep\n     10.​ fabricate crown provisional\n               ○​ fabricate Integrity provisionals before scanning\n               ○​ Integrity is used for crown provisionals & some onlays\n               ○​ Telio is used for inlay provisionals & some onlays -- if using Telio, you must scan before placing\n     11.​ pack cords\n               ○​ cords should be sitting in a dappen dish of Hemodent to soak\n               ○​ pack the first (smaller) bottom cord to control seepage & bleeding; it should be entirely below the margin\n                        ■​ the bottom cord should not have a tail\n               ○​ pack the second (larger) top cord above the first to further expand the sulcus\n                        ■​ the second cord should be at least size 1, ideally size 2\n                        ■​ half of the thickness of the top cord should fit into the sulcus — the cord should be entirely visible around\n                            the circumference of the tooth; any areas that the cord is submerged below the gingiva will result in\n                            gingival collapse once the cord is removed\n                        ■​ leave a tail for easy removal\n​\n\n12.​ set up the scanner\n\n                          open TRIOS software on the desktop\n\n                          click “Default operator”\n\n                          A. if the pt has been scanned in the digital clinic before: ​\n                                 - search & select the patient\n                                 - click “New Case”\n                          B. if the pt has not been scanned in the digital clinic before:\n                                 - click “New Patient”\n                                 - enter Axium no., name, & date of birth\n                                 - click “New Case”\n\n                          click “UIC Dental Lab”\n\n                          select the tooth on the model\n\n                          on the upper left, click “Anatomy”\n\n                          - select the type of restoration (crown, inlay, onlay)\n                          - set the material to e.max CAD\n                          - select the shade\n\n                          choose a delivery date (choose any random day; it just can’t be\n                          empty)\n\n                          click “Next”\n\n13.​ scan\n         ○​ first, scan the opposing arch\n                  ■​ maxillary: occlusal → buccal → lingual\n                  ■​ mandibular: occlusal → lingual → buccal\n                  ■​ stay below 1000 images ideally, 2000 images absolute maximum (erase & re-scan if over 2000)\n         ○​ next, scan the arch with the prep\n                  ■​ stay below 1000 images ideally, 2000 images absolute maximum (erase & re-scan if over 2000)\n         ○​ if you are using retraction cords:\n                  ■​ after scanning the arch with the prep, use the “Lock” tool — click & drag to color everything you’ve\n                      scanned except the prepped tooth (increase the size of the “Lock” tool to make this faster)\n                  ■​ then, click “Trim” to erase the prep\n                  ■​ intraorally, remove the top (second) retraction cord\n                  ■​ immediately scan the prepped tooth a 2nd time — the scanner will fill in the data of the prep\n         ○​ turn off colors to evaluate if your margin looks good\n         ○​ make sure you have captured interproximal ​\n            contacts & that you have enough occlusal clearance\n         ○​ mark the tooth (center bottom)​\n\n         ○​ the software will alert you if you need to scan more areas; scan as needed\n         ○​ lastly, scan the occlusion (distal to mesial) — the software will auto-occlude\n14.​ check in — have instructor check scans & provisional\n         ○​ click “Next” → click “Send”\n15.​ cement provisional\n         ○​ always always always apply Gluma to the crown prep before cementing the provisional!!! lots of patients are super\n              sensitive after crown preps with their provisional crown — exception: RCT teeth don’t need Gluma (duh)\n         ○​ check occlusion & ensure excess cement is removed\n         ○​ REMOVE CORDS\n         ○​ take photos if you want\n         ○​ if using Telio:\n                  ■​ twist the Telio to dispense into a dappen dish (do not contaminate)\n                  ■​ condense Telio into inlay prep with fingers\n                  ■​ use instruments to shape Telio, especially in embrasures\n                  ■​ light cure Telio 20s\n16.​ check in — have instructor check provisional after cementing\n17.​ complete codes & note\n         ○​ code for prep:\n                  ■​ DD2610A (Inlay porc/cer- 1 surface — Initial Preparation)\n                  ■​ DD2620A (Inlay porc/cer- 2 surface — Initial Preparation)\n                  ■​ DD2630A (Inlay porc/cer- 3 or more surface — Initial Preparation)\n                  ■​ DD2642A (Onlay porc/ cer 2 surface — Initial Preparation)\n                  ■​ DD2643A (Onlay porc/ cer 3 surface — Initial Preparation)\n                  ■​ DD2644A (Onlay porc/ cer 4 surface — Initial Preparation)\n                  ■​ DD2740A (Crown porcelain/ ceramic subs — Initial Preparation)\n         ○​ code for scan:\n                  ■​ DD2610B (Inlay porc/cer- 1 surface — Scan & Design)\n                  ■​ DD2620B (Inlay porc/cer- 2 surface — Scan & Design)\n                  ■​ DD2630B (Inlay porc/cer- 3 or more surface — Scan & Design)\n                  ■​ DD2642B (Onlay porc/ cer 2 surface — Scan & Design)\n                  ■​ DD2643B (Onlay porc/ cer 3 surface — Scan & Design)\n                  ■​ DD2644B (Onlay porc/ cer 4 surface — Scan & Design)\n                  ■​ DD2740B (Crown porcelain/ ceramic subs — Scan & Design)\n18.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c054.2",
"section": "DIGITAL",
"title": "DIGITAL PREP & SCAN — digital inlay prep & scan: note template",
"body": "digital inlay prep & scan: note template\n - y/o female patient presents to Chicago Digital clinic for #19-MO digital e.max inlay prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MO digital e.max inlay prep & scan:\n Completed inlay prep to ideal form. Scanned prep, opposing arch, & occlusion using TRIOS intraoral scanner. Verified margins, occlusal clearance,\n & interproximal contacts on scan.\n\n Selected shade HT-A2 for #19 digital inlay. Pt used hand mirror & confirmed shade verbally.\n\n #19-MO provisional:\n Provisionalized #19-MO inlay with Telio. Shaped & light-cured 20s. Occlusal & excursive contacts evaluated with articulating paper & adjusted to\n ideal — pt is not occluding on Telio.\n\n NV: #19-MO digital e.max inlay delivery"
},
{
"id": "c054.3",
"section": "DIGITAL",
"title": "DIGITAL PREP & SCAN — digital onlay prep & scan: note template",
"body": "digital onlay prep & scan: note template\n - y/o female patient presents to Chicago Digital clinic for #19-MODB digital e.max onlay prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MODB digital e.max onlay prep & scan:\n Completed onlay prep to ideal form. Scanned prep, opposing arch, & occlusion using TRIOS intraoral scanner. Verified margins, occlusal clearance,\n & interproximal contacts on scan.\n\n Selected shade HT-A2 for #19 digital onlay. Pt used hand mirror & confirmed shade verbally.\n\n #19-MODB provisional:\n Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp.\n Removed excess cement & flossed. Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts\n evaluated with floss & are satisfactory.\n\n NV: #19-MODB digital e.max onlay delivery"
},
{
"id": "c054.4",
"section": "DIGITAL",
"title": "DIGITAL PREP & SCAN — digital crown prep & scan: note template",
"body": "digital crown prep & scan: note template\n - y/o female patient presents to Chicago Digital clinic for #19 digital e.max crown prep\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19 digital e.max crown prep & scan:\n Completed crown prep to ideal form. Placed #00 &#0 gingival retraction cord soaked in Hemodent. Scanned prep, opposing arch, & occlusion using\n TRIOS intraoral scanner. Verified margins, occlusal clearance, & interproximal contacts on scan.\n\n Selected shade LT-A2 for #19 digital crown. Pt used hand mirror & confirmed shade verbally.\n\n #19 provisional:\n Fabricated provisional using Integrity shade A2. Adjusted to ideal shape with satisfactory marginal adaptation. Cemented with UltraTemp.\n Removed excess cement & flossed. Occlusal & excursive contacts evaluated with articulating paper & adjusted to ideal. Interproximal contacts\n evaluated with floss & are satisfactory.\n\n NV: #19 digital e.max crown delivery"
},
{
"id": "c055",
"section": "DIGITAL",
"title": "INLAY PREP",
"body": "●​ clear defined margins\n    ●​ minimum pulpal floor depth 1.5 mm\n    ●​ minimum isthmus width 1.5 mm\n    ●​ divergent internal axial walls (including axial walls of box) — diverge toward occlusal 6-10°\n    ●​ interproximal cavosurface angle 100-120°\n    ●​ rounded internal line angles — especially axiopulpal line angle"
},
{
"id": "c056",
"section": "DIGITAL",
"title": "ONLAY PREP",
"body": "●​ clear defined margins\n   ●​ minimum pulpal floor depth 1.5 mm\n   ●​ minimum isthmus width 1.5 mm\n   ●​ divergent internal axial walls (including axial walls of box) — diverge toward occlusal 6-10°\n   ●​ interproximal cavosurface angle 100-120°\n   ●​ rounded internal line angles — especially axiopulpal line angle\n   ●​ reduced cusps 1.5-2.0 mm\n   ●​ reduced cusps butt joint or heavy chamfer\n\nexample of butt joint on buccal cusps:"
},
{
"id": "c057",
"section": "DIGITAL",
"title": "CROWN PREP",
"body": "●​ reduction:\n           ○​ 1.25 - 1.5 mm axial\n           ○​ 1.5 - 2.0 mm occlusal\n           ○​ 1.0 - 1.25 mm chamfer\n   ●​ finish line 0.5 mm supragingival\n   ●​ 6-10° taper\n   ●​ very rounded & smooth"
},
{
"id": "c058.0",
"section": "DIGITAL",
"title": "DIGITAL DELIVERY — digital delivery: equipment",
"body": "digital delivery: equipment\n     ●​ from sterilization: fixed prosth kit, perio kit (for sickle scaler), radiograph kit, handpieces, prophy handpiece, fixed prosth\n          burs, lab burs, digital prep burs, e.max extraoral burs, e.max intraoral burs, extraoral camera, cheek retractors + mirrors,\n          Isodry, patient goggles, blood glucose kit -- make sure you have extraoral provisional burs & curing light\n     ●​ from locker: patient casts with wax-up completed, putty matrix, blood pressure cuff, loupes and/or eye protection\n     ●​ in Chicago office: Panavia cement kit, pic-n-stic, restoration (on shelf near Dan’s office), x-ray sensor\n     ●​ in clinic: articulating paper, microbrushes, dappen dishes, cords + Hemodent + dappen dish, Consepsis\n     ●​ in unit: floss, prophy angle, pumice"
},
{
"id": "c058.1",
"section": "DIGITAL",
"title": "DIGITAL DELIVERY — digital delivery: steps",
"body": "digital delivery: steps\n     1.​ before you seat the pt:\n               ○​ pick up the restoration from Dan / the shelf near the digital office\n               ○​ cavicide the restoration\n     2.​ get a start check\n     3.​ check occlusion\n               ○​ before any anesthetic, use articulating paper to check occlusion on the tooth you’re going to work on & the 2\n                    adjacent teeth (or other teeth on that side)\n               ○​ draw a little picture of the teeth & the contacts you see → at the end, you can compare post-op occlusion to pre-op\n                    occlusion (especially making sure occlusion on adjacent teeth is the same)\n     4.​ remove the sprue from the restoration\n               ○​ hold the restoration (do not hold the block) — when removing the sprue, the block may fly away (preventing the\n                    restoration from flying away)\n               ○​ use the diamond disk (in the red provisional bur block) to segment cut the sprue to separate the restoration & the\n                    block (do not damage the restoration)\n               ○​ use the pink/red colored disc to remove the remainder of the sprue & smooth the remaining area\n     5.​ place Isodry\n               ○​ use Isodry to keep the area dry & prevent aspiration of the restoration\n     6.​ remove provisional\n               ○​ for Integrity provisionals:\n                        ■​ first use your fingers to see if provisional is loose/easily removed\n                        ■​ if you can’t get the provisional off with your hands alone, try using a hemostat — don’t use too much force\n                             or you might damage the provisional (and if the permanent restoration doesn’t fit, you’ll have to make a\n                             new provisional)\n                        ■​ if you can’t get the provisional off with a hemostat, use a sickle scaler to very gently loosen the provisional\n                             at the margins — take great care not to damage the margins or the final restoration won’t fit — then use a\n                             hemostat\n                        ■​ clean cement with a scaler\n               ○​ for Telio:\n                        ■​ use a sharp hatchet to wiggle & loosen the Telio — it usually comes out in a big piece\n               ○​ clean tooth with prophy angle & pumice (not prophy paste with fluoride)\n     7.​ try restoration in\n               ○​ use floss to evaluate interproximal contacts — hold the restoration with your finger so you don’t dislodge it\n               ○​ evaluate margins with an explorer\n     8.​ if restoration doesn’t fit\n               ○​ adjust interproximal contacts first\n                        ■​ the most common cause for a restoration failing to seat all the way is too tight of interproximal contacts\n                        ■​ mark the interproximal contacts with articulating paper → adjust restoration with burs → see if\n                             restoration fits now\n               ○​ then, adjust prep as needed:\n                        ■​ mark intaglio of restoration:\n                                  ●​ lay articulating paper over prep → seat restoration on top of articulating paper into prep\n                                  ●​ spray FitChecker into intaglio of restoration → seat restoration into prep\n                        ■​ adjust preparation accordingly\n                                  ●​ round sharp edges of the preparation, or anywhere where there is marking from articulating\n                                      paper / FitChecker\n     9.​ evaluate esthetics\n               ○​ ask patient if they are happy with esthetics — shape, size, & color\n\n10.​ check in — have instructor check restoration\n11.​ take bitewing\n          ○​ take a bitewing (PA for anterior teeth) to verify full seating & closed margins (before cementation)\n12.​ adjust occlusion\n          ○​ use articulating paper to evaluate occlusion\n          ○​ use different color articulating paper to evaluate excursive movements\n          ○​ use ceramic burs to adjust occlusion now extraorally (before cementation)\n13.​ adjust contours\n          ○​ adjust contours as needed\n14.​ polish\n          ○​ use the e.max polishing burs in correct sequence to polish the restoration before crystallizing\n15.​ clean & crystallize\n          ○​ remove all articulating paper marks\n          ○​ soak restoration in a cup of Cavicide for 1 minute\n          ○​ rinse restoration & put it in a cup of water\n          ○​ bring to Dan for crystallization (25 min)\n16.​ try in crystallized restoration\n          ○​ re-confirm interproximal contacts, margins, & occlusion\n17.​ cement restoration\n          ○​ prepare the restoration:\n                    1   air dry 100%\n\n                    2   (inlays and onlays) use a pick-n-stick to hold the restoration (stick to occlusal)\n\n                        Ivoclean 20s\n                                                                                              cleans & removes saliva\n                    3   rinse\n                                                                                              contaminants\n                        dry\n\n                                                                                              5% hydrofluoric acid (HF)\n                        IPS Ceramic Etching Gel 20s\n                                                                                              acts on silicate glass fillers: increases\n                    4   rinse\n                                                                                              bonding surface area &\n                        dry\n                                                                                              micro-mechanical retention\n\n                        Clearfil Ceramic Primer 60s\n                                                                                              adhesive primer;\n                    5   no rinse!\n                                                                                              contains MDP & silane\n                        dry\n\n         ○​ prepare the tooth:\n                    1   isolate\n\n                    2   clean tooth with prophy cup & pumice (fluoride-free)\n\n                    3   clean tooth with Consepsis\n\n                        mix equal amounts A Primer and B Primer\n                        apply 30s                                                                          - self-etching primer\n\n                        no rinse!                                                                          - bonding agent\n                        dry\n\n         ○​ cement:\n                        mix equal amounts Panavia Paste A and Panavia Paste B with the plastic spatula\n\n                    2   apply to intaglio of restoration with microbrush\n\n                    3   seat restoration\n\n                    4   remove excess cement\n\n                    5   light cure 20s each surface\n\n18.​ verify margins, interproximal contacts, & occlusion\n          ○​ verify margins\n          ○​ verify interproximal contacts with floss\n          ○​ use articulating paper to verify occlusal contacts & excursive contacts — adjust to ideal with burs\n19.​ polish restoration\n          ○​ if you adjusted the restoration at all, re-polish\n20.​ give post-op instructions\n          ○​ no sticky foods for 24 hours; call if bite feels uneven or if pain\n21.​ complete codes & note\n          ○​ DD2610C (Inlay porc/cer- 1 surface — Delivery)\n          ○​ DD2620C (Inlay porc/cer- 2 surface — Delivery)\n          ○​ DD2630C (Inlay porc/cer- 3 or more surface — Delivery)\n          ○​ DD2642C (Onlay porc/ cer 2 surface — Delivery)\n          ○​ DD2643C (Onlay porc/ cer 3 surface — Delivery)\n          ○​ DD2644C (Onlay porc/ cer 4 surface — Delivery)\n          ○​ DD2740C (Crown porcelain/ ceramic subs — Delivery)\n22.​ check in — have instructor swipe EPR/codes/note"
},
{
"id": "c058.2",
"section": "DIGITAL",
"title": "DIGITAL DELIVERY — digital delivery: note template",
"body": "digital delivery: note template\n - y/o female patient presents to Vivaldi clinic for #19-MODB digital e.max onlay delivery\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #4.\n\n #19-MODB digital e.max onlay delivery:\n\n Removed sprue & prepared onlay for pre-crystallization try-in. Placed Isodry (size M). Removed provisional onlay. Removed temporary cement with\n a scaler. Cleaned tooth with pumice & prophy angle\n\n Pre-crystallization try-in:\n - Marginal adaptation satisfactory; verified visually, tactilely, & radiographically (BW taken).\n - Interproximal contacts adjusted with a bur; contacts are satisfactory as evaluated with floss.\n - Occlusal & excursive contacts adjusted with a bur; contacts are satisfactory as evaluated with articulating paper.\n\n Crystallization try-in:\n - [ Stains added? ]. Crystallized using regular glaze and regular firing cycle. [ spray glaze and speed firing cycle ]\n - Crystallized restoration tried in. Adjusted [surfaces].\n - Pt expressed satisfaction with final shade of restoration.\n - Total number of restorations milled: 1 [reason]\n\n Cementation -- Panavia F2.0 resin cement:\n - Restoration intaglio cleaned with Ivoclean 20s, rinsed, dried; etched with 5% HF acid 20s, rinsed, dried; primed with Clearfil ceramic primer 1m,\n dried.\n - Tooth isolated with Isodry. Scrubbed with Consepsis, rinsed, dried; primed with Primer A+B 30s, dried.\n - Mixed Panavia cement pastes A&B (shade TC). Cemented restoration. Removed excess cement. Flossed. Light cured 20s per side.\n - Took BW to verify closed margins. Verified interproximal contacts. Evaluated & adjusted occlusal contacts & excursive contacts to ideal. Polished\n ceramic.\n - Pt is satisfied with bite & esthetics. Gave verbal post-op instructions re: 24 hr set, uneven bite, sore injection site.\n\n NV:"
},
{
"id": "c059.0",
"section": "ENDO",
"title": "RCT — 1 VISIT — RCT: equipment",
"body": "RCT: equipment\n    ●​ from sterilization: rotary system, electronic apex locator + tip/clip, calamus + tip, endo kit, rubber dam kit, handpieces, endo\n        burs, manual files (usually 25 mm), rotary files (usually 25 mm), ring + sponge, endo radiograph holder (green or purple),\n        septocaine\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: rubber dam, RC Prep, cup of NaOCl, cup of EDTA, syringe tube + yellow needle tip (2), Cavit + key, surgical suction\n        tip\n    ●​ in unit: anesthetic needle/carpule/shield/topical, floss, Endo Ice, cotton swabs, mixing pad, articulating paper"
},
{
"id": "c059.1",
"section": "ENDO",
"title": "RCT — 1 VISIT — RCT: steps",
"body": "RCT: steps\n    1.​ get a start check\n    2.​ obtain informed consent\n             ○​ discuss procedure with pt\n             ○​ emphasize need for crown final restoration\n             ○​ have pt sign tx plan\n             ○​ confirm that the tooth is restorable with restorative faculty\n    3.​ reconfirm endo tests\n             ○​ if it has been a while since first endo diagnosis, reconfirm the endo tests\n             ○​ not always necessary\n    4.​ deliver local anesthetic\n             ○​ symptomatic teeth are notoriously difficult to get numb\n             ○​ for maxillary teeth, default anesthetic should be 1 carp lidocaine + 1 carp articaine buccal infiltration\n             ○​ for mandibular anteriors & premolars, default anesthetic should be 1 carp lidocaine IAN + 1 carp articaine mental\n                  block\n    5.​ isolate with rubber dam\n             ○​ don’t forget to tie floss to the clamp\n             ○​ single-tooth isolation only\n             ○​ CONFIRM MULTIPLE TIMES THAT YOU HAVE ISOLATED THE CORRECT TOOTH\n    6.​ excavate caries\n             ○​ completely remove any caries\n             ○​ reduce occlusion (ask instructor if they want you to)\n    7.​ access\n             ○​ see access shapes\n             ○​ unroof pulp chamber completely\n             ○​ achieve straight-line access\n             ○​ remove pulp tissue with slow-speed round bur, if necessary\n             ○​ after your access is complete (you’re done drilling), switch from high-volume suction to surgical suction\n    8.​ irrigate\n             ○​ irrigate throughout procedure with NaOCl; canals should never be dry\n             ○​ do not bind the needle! = don’t wedge or force the needle; keep it moving gently up & down while irrigating\n    9.​ locate & pre-flare canals\n             ○​ locate canals with #8/#10 SS file\n             ○​ pre-flare orifices of canals with Vortex orifice opener (blue) in light pecking motion (no heavy pressure)\n    10.​ determine WL\n             ○​ estimate working length (tentative working length = TWL) using radiograph & Dexis measurement tool\n             ○​ use #10/#15 SS file to establish patency — insert the file into the canal to TWL +1\n             ○​ use electronic apex locator to confirm working length\n                       ■​ connect the lip clip to the white cable; connect the file holder to the gray cable\n                       ■​ hook the lip clip onto the patient’s cheek\n                       ■​ push the end of the file clip to open the hook → hook onto #10/#15 SS file (between stopper & handle)\n                       ■​ insert file into canal\n                       ■​ for an accurate reading, overextend the file to/past the apex, then back up into the ideal -1mm position\n             ○​ don’t forget to record your reference point\n    11.​ check in — have instructor check your access\n    12.​ take WM radiograph\n             ○​ insert a #15 or #20 file into each canal (different files) to TWL (use the largest file that fits passively)\n             ○​ record reference point\n\n          ○​ take radiograph\n          ○​ for multiple canals, move the cone distally (or mesially) → take another radiograph\n          ○​ adjust files as necessary & take new radiographs as necessary to obtain WL\n13.​ create guide path\n          ○​ instrument with #10 SS file → #15 SS file → #20 SS file — main goal is to make sure that #20 SS file goes to working\n                length\n14.​ check in — have instructor confirm your WL\n15.​ cleanse & shape canals\n          ○​ set powered files #20 through #50 to WL\n          ○​ set manual #10 SS file to WL+1 (for recapitulation)\n          ○​ instrument the canal with the #50 file for 3-4 seconds light pecking pressure\n                    ■​ do not bind, do not apply heavy pressure\n          ○​ irrigate with NaOCl\n          ○​ recapitulate with #10 SS file (WL+1)\n          ○​ repeat with smaller files: #45 file, irrigate, recapitulate → #40, irrigate, recapitulate → #35, irrigate, recapitulate …\n          ○​ first file to reach working length is the IAF (initial apical file)\n                    ■​ IAF may be #20 (guide path file) or may be larger\n                    ■​ determine MAF: IAF + 3 sizes = MAF (master apical file)\n          ○​ once you’ve determined IAF, start the cycle over again with #50 → #45 → #40 …\n          ○​ repeat the cycle until MAF reaches working length\n          ○​ no need to step back if using powered instruments\n16.​ fit master cone\n          ○​ master cone size = MAF size\n          ○​ fit master cone into wet canal\n17.​ take master cone radiograph\n          ○​ take radiograph with master cone temporarily in place (not yet sealed in place)\n18.​ check in — have instructor confirm your master cone fit\n19.​ final irrigation\n          ○​ irrigate with NaOCl → irrigate with EDTA (let sit 1 minute) → irrigate again with NaOCl\n20.​ dry canals\n          ○​ used needle to aspirate liquid from canal\n          ○​ dry canals fully with paper points — final paper point should come out completely dry\n21.​ obturate\n          ○​ coat master cone with sealer\n          ○​ insert master cone into canal & pump up/down 3 times\n          ○​ remove master cone, re-coat with sealer, re-insert into canal, pump up/down 3 times, seat fully\n          ○​ condense & melt off excess gutta percha with heat calamus\n22.​ place sponge & cavit\n          ○​ place sterile sponge into pulp chamber\n          ○​ cover sponge & fill access hole with Cavit (use wet cotton swab to manipulate)\n23.​ check in — have instructor check final obturation\n24.​ complete codes & note\n          ○​ D3310A —Access (Endo therapy -- anterior)\n          ○​ D3310B —Fill (Endo therapy -- anterior)\n          ○​ D3320A —Access (Endo therapy -- premolar)\n          ○​ D3320B —Fill (Endo therapy -- premolar)\n          ○​ D3330A —Access (Endo therapy -- molar)\n          ○​ D3330B —Fill (Endo therapy -- molar)\n          ○​ D0225 — Intraoral-periapical 1st N/C\n          ○​ label your wire measurement & final radiographs on Dexis (right click → Annotation)\n25.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c059.2",
"section": "ENDO",
"title": "RCT — 1 VISIT — RCT: note template",
"body": "RCT: note template\n - y/o female patient presents to UG clinic for #12 RCT -- same day access & fill\n - medical history: RMH; no changes\n - allergies:\n - blood pressure:\n - blood glucose:\n - temperature: ºF\n\n COVID-19:\n Took pt’s temperature & pt used hand sanitizer upon entry to clinic. Pt wore face mask except when in dental chair during active treatment.\n Completed COVID-19 screening form, pt responds “NO” to all questions & is approved for treatment today.\n\n CC: “My upper left tooth hurts and I was referred here for a root canal”\n\n Re-confirmed findings from endo consult visit 1/1/2021 1 month ago:\n - EOE: WNL -- no lymphadenopathy, no swelling, no erythema, no asymmetries\n - IOE: WNL -- no soft tissue pathology, no sinus tract, no vestibular swelling\n - hard tissue exam: #12 existing DO composite with recurrent decay\n - symptoms: pain on chewing\n - #12 is restorable as confirmed with Dr. ?\n\n Endo tests:\n - #: percussion +++, palpation +++, probing X mm, mobility 1, cold test NR\n - #: percussion -, palpation -, probing X mm, mobility 0, cold test 2/2 s\n\n Radiographic exam:\n - Re-evaluated BW & PA taken 1/1/2021\n - Periapical radiolucency #12\n - #12 large DO composite approaching pulp, recurrent decay\n\n Diagnosis #12:\n - Pulpal dx: necrotic pulp\n - Periapical dx: symptomatic apical periodontitis\n\n Thoroughly reviewed treatment options, timelines, & costs with the pt. Discussed advantages & disadvantages of treatment. Answered pt’s\n questions, pt understood tx options. Pt opts to proceed with RCT #12. Specifically discussed need for pt to return to primary dentist for a crown.\n Verbal & written consent obtained.\n\n #12 RCT:\n\n Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal\n block on right / buccal infiltration #12.\n\n Rubber dam placed. Excavated caries completely. Accessed, completely unroofed pulp chamber, & achieved straight-line access. Located 2 canals.\n Pre-flared with Vortex orifice opener #20/.08. Determined WL with electronic apex locator. Confirmed WL with WM radiograph taken straight and\n from distal. Created guide path with #10, #15 SS files. Cleansed & shaped canals with powered rotary files. Reconfirmed patency and copious\n irrigation with 1% NaOCl throughout procedure. Fitted mater cones and took radiograph.\n\n Buccal canal -- WL 18.5 mm (reference point: buccal cusp tip)\n Palatal canal -- WL 18.0 mm (reference point: lingual cusp tip)\n MAF: 35 (buccal & palatal)\n\n Final irrigation with 1% NaOCl, 17% EDTA, 1% NaOCl. Dried canals with needle aspiration and paper points. Obturated with Endoseal MTA sealer and\n master cone. Took post-op radiograph. Placed sponge & Cavit.\n\n POI given verbally. Pt tolerated procedure well and left in stable condition.\n\n - NV:"
},
{
"id": "c060",
"section": "ENDO",
"title": "RCT — TOOTH ANATOMY",
"body": "tooth             roots & canals           access\n\nmaxillary\n\n                  1 root\ncentral incisor\n                  1 canal\n\n                  1 root\nlateral incisor\n                  1 canal\n\n                  1 root\ncanine\n                  1 canal\n\n                  2 roots\n                  2 canals\n1st premolar\n                  otherwise (35%):\n                  1 root\n                  2 canals\n\n                  1 root\n2nd premolar\n                  1 or 2 canals (50/50%)\n\n                  3 roots\n                  4 canals (MB2 60%)\n1st molar\n                  otherwise (40%):\n                  3 roots\n                  3 canals\n\n                  3 roots\n                  3 canals\n2nd molar\n                  otherwise:\n                  3 roots\n                  4 canals\n\nmandibular\n\n                  1 root\n                  1 canal\ncentral incisor\nlateral incisor   otherwise (30%):\n                  1 root\n                  2 canals\n\n                  1 root\n                  1 canal\nlateral incisor\n                  otherwise (45%):\n                  1 root\n                  2 canals\n\n                  1 root\n                  1 canal\ncanine\n                  otherwise (30%):\n                  1 root\n                  2 canals\n\n               1 root\n               1 canal\n1st premolar\n               otherwise (30%):\n               1 root\n               2 canals\n\n               1 root\n               1 canal\n2nd premolar\n               otherwise (15%):\n               1 root\n               2 canals\n\n               2 roots\n               3 canals\n1st molar\n               otherwise:\n               2 roots\n               4 canals\n\n               2 roots\n               3 canals\n2nd molar\n               otherwise:\n               2 roots\n               4 canals"
},
{
"id": "c061.0",
"section": "PEDS",
"title": "PEDS INFO — Link to Peds Lab Manual",
"body": "Link to Peds Lab Manual\n\npediatric assistants: Arely, Patricia, Lisa\npediatric front desk: Olga\nif you need access to a pediatric chart\n     ●​ go to the 2nd floor pediatric front desk & ask anyone there, or…\n     ●​ send an Axium message to Olga Valdez (peds front desk)\n\nrubber dam clamps: 14 for primary molar, 14A for permanent molar\npeds scheduling / insurance coverage\n    ●​ POE — DHS covers 1 POE exam every 6 months + 1 day\n    ●​ radiographs — DHS covers bitewings every 1 year + 1 day\n            ○​ pano cannot be taken on the same day as bitewings\n    ●​ fluoride varnish — DHS covers 1 fluoride varnish application every 6 months + 1 day"
},
{
"id": "c061.1",
"section": "PEDS",
"title": "PEDS INFO — peds appointment color",
"body": "peds appointment color\n    ●​ white = operative\n    ●​ green = initial exam (COE)\n    ●​ purple = recall exam (POE)\n\nstages of the dentition\n    ●​ primary dentition: all primary teeth — 6 months - 6 years\n    ●​ early mixed dentition: eruption of permanent first molars + incisors — 6 - 9 years\n    ●​ intermediate period: 1-2 year waiting period during which no teeth erupt — 9 - 10 years\n    ●​ late mixed dentition: eruption of permanent canines + premolars + 2nd molars — 10 - 13 years\n    ●​ permanent dentition: loss of all primary teeth — 12 - 13 years +\n\nincisor liability\n     ●​ incisor liability: the discrepancy between the amount of space required by & the amount of space available for the\n          permanent incisors (primary incisors are much smaller mesiodistally than the permanent incisors)\n     ●​ incisor liability is overcome by 3 means: (a) anterior eruption & proclination of permanent incisors;\n          (b) increase in intercanine width; (c) anterior spacing in the primary dentition\n\nspaces & shifts\n    ●​ primate space: a space mesial to maxillary primary canines & distal to mandibular primary canines\n    ●​ the early mesial shift results in loss of primate space due to eruption of the permanent first molars\n    ●​ leeway space: the difference in mesiodistal width between: the primary canine + primary molars & the\n        permanent canine + permanent premolars\n             ○​ maxillary leeway space is 1.5 mm per side, 3 mm per arch\n             ○​ mandibular leeway space is 2.5 mm per side, 5 mm per arch\n    ●​ the late mesial shift results in loss of leeway space due to mesial shift of erupting permanent premolars\n\nocclusion in the primary dentition\n    ●​ before permanent molar eruption, Angle classification cannot be determined, however it can be predicted based on the\n        position of the primary second molars\n              (1)​ flush terminal plane\n                        ●​ with minimal growth → end-to-end permanent molars\n                        ●​ with forward growth of mandible → class I permanent molars\n              (2)​ mesial step\n                        ●​ with minimal growth → class I permanent molars\n                        ●​ with forward growth of mandible → class III permanent molars\n              (3)​ distal step\n                        ●​ with minimal growth → class II permanent molars\n                        ●​ with forward growth of mandible → end-to-end molars permanent molars\n\nFrankl behavior rating scale\n               Definitely negative. Refusal of treatment, forceful crying, fearfulness, or any other overt evidence of extreme negativism.\n 1     ––\n               Patients that you are not able to treat due to behavior. Likely will require advanced techniques to treat.\n\n               Negative. Reluctance to accept treatment, uncooperative, some evidence of negative attitude but not pronounced\n 2      –\n               (sullen, withdrawn). The work can be completed but is a struggle. May require advanced techniques.\n\n               Positive. Acceptance of treatment; cautious behavior at times; willingness to comply with the dentist, at times with\n 3      +      reservation, but patient follows the dentist’s directions cooperatively. Work is finished, patient is generally happy but may\n               have struggled a bit. Can be managed with basic techniques. Be sure to document difficult areas for future visits.\n\n               Definitely positive. Good rapport with the dentist, interest in the dental procedures, laughter and enjoyment. Little effort\n 4     ++\n               needed for behavior management.\n\npediatric anesthetic\n    ●​ maximum dose for pediatric patients is 4.4 mg per kg of body weight\n    ●​ always use the regular (20 mm, 30g) blue needle in peds patients, even for IAN\n             ○​ only exception is large teens (age 12+) for IAN; check with instructor first\n\nAAPD max dose\n                    maximum number of 1.8 mL carpules\n                                                        2% Lidocaine\n     pt age        pt weight (lb)    pt weight (kg)\n                                                      number of carpules\n      1 yr             16.5               7.5                 0.9\n                       22.0              10.0                 1.2\n     2-3 yr\n                       27.5              12.5                 1.5\n                       33.0              15.0                 1.8\n     4-5 yr\n                       38.5              17.5                 2.1\n                       44.0              20.0                 2.4\n     6-8 yr\n                       49.5              22.5                 2.8\n                       55.0              25.0                 3.1\n     9-10 yr\n                       66.0              30.0                 3.7\n                       71.5              32.5                 4.0\n                       77.0              35.0                 4.3\n     11+ yr\n                       82.5              37.5                 4.6\n                       88.0              40.0                 4.9\n\n      carpules of            minimum\n     2% lidocaine          pt weight (lb)\n              1                     18\n             1.5                    27\n              2                     36\n             2.5                    45\n              3                     54\n\nmax dose\n   ●​ to give 1 carpule, the patient must weigh at least 18 pounds\n   ●​ to give 1.5 carpules, the patient must weigh at least 27 pounds\n   ●​ to give 2 carpules, the patient must weight at least 36 pounds\n   ●​ to give 2.5 carpules, the patient must weight at least 45 pounds\n   ●​ to give 3 carpules, the patient must weigh at least 54 pounds\n\nnitrous oxide contraindications\n     ●​ inner ear infections\n     ●​ blocked nasal passages\n     ●​ COPD\n     ●​ pre-existing nausea or vomiting\n     ●​ claustrophobia or emotional disturbances\n     ●​ bleomycin sulfate (chemo drug)\n     ●​ methylenetetrahydrofolate reductase deficiency\n     ●​ cobalamin deficiency\n     ●​ nitrous oxide used in past 7 days"
},
{
"id": "c062.0",
"section": "PEDS",
"title": "TOOTH ERUPTION — permanent teeth eruption",
"body": "permanent teeth eruption\n                                                      MAXILLARY                                                                 MANDIBULAR\n                         initial            enamel                                                      initial            enamel\n                                                               eruption           root completion                                            eruption      root completion\ntooth                 calcification       completion                                                 calcification       completion\ncentral incisor        3 - 4 mo.              4-5                  7-8                    10          3 - 4 mo.             4-5                6-7                9\nlateral incisor       10 - 12 mo.             4-5                  8-9                    11          3 - 4 mo.             4-5                7-8                10\ncanine                 4 - 5 mo.              6-7                 11 - 12               13 - 15       4 - 5 mo.             6-7               9 - 10           12 - 14\n1st premolar           1½ - 1¾ yr.            5-6                 10 - 11               12 - 13       1¾ - 2 yr.            5-6               10 - 12          12 - 13\n2nd premolar           2 - 2½ yr.             6-7                 10 - 12               12 - 14       2¼ - 2½ yr.           6-7               11 - 12          13 - 14\n1st molar               at birth              3-4                  6-7                  9 - 10         at birth            2½ - 3              6-7              9 - 10\n2nd molar              2½- 3½ yr.             7-8                 12 - 13               14 - 16       2½- 3½ yr.            7-8               11 - 13          14 - 15\n3rd molar               7 - 9 yr.           12 - 16               17 - 21               18 - 25        8 - 10 yr.          12 -16             17 - 21          18 - 25\n\nprimary teeth eruption\n      tooth           initiation         calcification             eruption              order\n                                                          mandibular 6 months              #1\ncentral incisor 6 weeks in utero 14 weeks in utero\n                                                          maxillary         7 months       #3\n                                                          mandibular 12 months             #5\nfirst molar        6 weeks in utero 15 weeks in utero\n                                                          maxillary         14 months      #6\n                                                          mandibular 7 months              #2\nlateral incisor 6 weeks in utero 16 weeks in utero\n                                                          maxillary         9 months       #4\n                                                          mandibular 16 months             #7\ncanine             7 weeks in utero 17 weeks in utero\n                                                          maxillary         18 months      #8\n                                                          mandibular 20 months             #9\nsecond molar 7 weeks in utero 19 weeks in utero\n                                                          maxillary         24 months     #10\n\nHOW MANY TEETH?\n age primary teeth permanent teeth total teeth permanent teeth\n                                                          maxillary: 1st molars\n  6           18                    6            24\n                                                          mandibular: central incisors, 1st molars\n                                                          maxillary: central incisors, 1st molars\n  7           14                    10           24\n                                                          mandibular: central incisors, lateral incisors, 1st molars\n                                                          maxillary: central incisors, lateral incisors, 1st molars\n  8           12                    12           24\n                                                          mandibular: central incisors, lateral incisors, 1st molars\n                                                          maxillary: central incisors, lateral incisors, 1st molars\n  9           10                    14           24\n                                                          mandibular: central incisors, lateral incisors, canines, 1st molars\n                                                          maxillary: central incisors, lateral incisors, 1st premolars, 2nd premolars, 1st molars\n 10           4                     20           24\n                                                          mandibular: central incisors, lateral incisors, canines, 1st premolars, 1st molars\n                                                          maxillary: central incisors, lateral incisors, canines, 1st premolars, 2nd premolars, 1st molars\n 11           0                     26           26\n                                                          mandibular: central incisors, lateral incisors, canines, 1st premolars, 2nd premolars, 1st molars, 2nd molars\n                                                          maxillary: central incisors, lateral incisors, canines, 1st premolars, 2nd premolars, 1st molars, 2nd molars\n 12           0                     28           28\n                                                          mandibular: central incisors, lateral incisors, canines, 1st premolars, 2nd premolars, 1st molars, 2nd molars"
},
{
"id": "c063.0",
"section": "PEDS",
"title": "PEDS INITIAL/RECALL — peds initial/recall: equipment",
"body": "peds initial/recall: equipment\n    ●​ from sterilization: peds exam kit, prophy handpiece, radiograph kit, peds goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: prophy angle, prophy paste, fluoride, floss"
},
{
"id": "c063.1",
"section": "PEDS",
"title": "PEDS INITIAL/RECALL — peds initial/recall: steps",
"body": "peds initial/recall: steps\n    1.​ present pt to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present patient age, gender, medical history, date of last POE, date of last radiographs, date of last fluoride varnish,\n                   significant dental history, & planned procedure for that day, including if you’ll be taking radiographs\n    2.​ seat patient & bring guardian\n              ○​ weigh the patient (scale by front door) — you don’t need to take blood pressure\n              ○​ under the “Forms” tab, open “Pediatric Exam”\n              ○​ fill out the “Medical History” tab & the “Risk Assessment” tab with the guardian\n                        ■​ if POE, make any changes you need to these tabs; if there is no change, press Ctrl + R on the keyboard to\n                             refresh an entry to today’s date\n              ○​ go over today’s procedure with the guardian\n    3.​ give “anticipatory guidance”\n              ○​ give OHI & nutritional counseling to the parent\n              ○​ nutritional counseling:\n                        ■​ no juice in infants under 1 y/o\n                        ■​ juice/soda (anything but water or milk) should be limited to 1 time per day with meals or with a snack\n                        ■​ juice/soda should be one small child-size cup (4-8 oz) — not a can or bottle of juice/soda\n                        ■​ snacks should be limited to 1 between breakfast & lunch and 1 between lunch & dinner\n                        ■​ diet should include a healthy variety of fruits & vegetables\n              ○​ OHI:\n                        ■​ brushing 2 times a day and flossing 1 time a day (any teeth that touch each other)\n                        ■​ guardian needs to supervise & help with brushing every time — if guardian forgets, guardian needs to look\n                             inside pt’s mouth to evaluate\n                        ■​ there are 3 parts of teeth that you need to brush: the front part along the gums (buccal), the chewing part\n                             (occlusal), and the tongue part along the gums (lingual)\n                        ■​ if patient has history of interproximal caries, recommend flossing & mouthwash\n    4.​ ask parent to wait in waiting room\n    5.​ complete prophy\n              ○​ use prophy cup to remove gross plaque\n              ○​ remove stains, plaque, & calculus with hand instruments — all you’ll use is the 2 scalers/curettes that come in the\n                   peds kit; you don’t use a cavitron & you don’t need to check out a perio kit\n    6.​ take radiographs\n              ○​ take planned radiographs\n                        ■​ if you want to take more images than planned, check with your instructor first\n                        ■​ if you need to retake an image, check with your instructor first\n              ○​ small patients (~7 or under) use the Gendex radiograph system; large patients (~7 or older) use the Dexis\n                   radiograph system\n                        ■​ the radiograph equipment is in boxes in the peds support room\n                        ■​ the sensor can be used with foam pads, with the handle, or\n                             with the regular Dexis plastic kit\n                        ■​ select the appropriate sensor (DEXIS or GENDEX) from the\n                             drop down menu\n              ○​ first panoramic radiograph is indicated at age 7 & is covered by\n                   Medicaid insurance\n              ○​ interpret radiographs & add any findings to the odontogram\n    7.​ perform exam\n              ○​ perform EOE & IOE — fill out the “Dent/Oral History” tab and the\n                   “Occlusion” tab\n              ○​ perform hard tissue exam — update the odontogram\n                        ■​ to change a tooth from primary to adult on the odontogram:\n                             select tooth → right click → “Age Change”\n\n8.​ treatment plan\n         ○​ if patient needs treatment, create a treatment plan under the “Treatment Plan” tab\n9.​ instructor review\n         ○​ present the patient to your instructor — age, medical history, findings, caries, & treatment plan\n         ○​ let the instructor know that you haven’t done OHI yet but that you’ll do it when you bring the guardian back in\n         ○​ instructor will check patient\n         ○​ have the instructor swipe to approve any changes to the treatment plan\n10.​ apply fluoride varnish\n         ○​ dry the teeth with gauze then air-dry → apply fluoride varnish\n         ○​ it is important to apply fluoride varnish after instructor has checked prophy & work\n11.​ demonstrate OHI\n         ○​ reinforce OHI with the patient by showing them how to brush\n         ○​ go get a “goodie bag” from the assistants (tell them how old your patient is) so that you have a toothbrush\n         ○​ use the hand mirror & the toothbrush to show the patient how to brush\n         ○​ emphasize areas that the patient has high plaque accumulation\n         ○​ ask the patient to do what you have just showed them\n12.​ present treatment plan to guardian\n         ○​ invite parents back to operatory\n         ○​ review findings & treatment plan with guardian\n         ○​ have guardian sign treatment plan\n         ○​ reinforce OHI, nutritional counseling, & anything else you need to tell them\n13.​ schedule next visit\n         ○​ if the patient needs restorative work, schedule it with you at your next open appointment\n                   ■​ guardians are aware that they will only have that one day/time available\n         ○​ if the patient does not need restorative work & next visit will be POE/prophy, you have to wait to schedule them —\n              you cannot schedule patients 6 months out so you’ll have to give them a call later to schedule them (don’t forget!)\n         ○​ type the next visit procedure under “Reason”\n         ○​ give the guardian an appointment card (located on the low red locker-looking desk thing near the front door)\n         ○​ guardian & patient can leave after they schedule the next appointment\n14.​ complete codes & note\n         ○​ complete all 3 subcodes of D0150 (Comprehensive oral evaluation)\n         ○​ D0120 (Periodic oral evaluation)\n         ○​ D1120 (Prophy — child)\n         ○​ D0274 (Bitewing — 4 films)\n         ○​ D1206 (Topical fluoride varnish)\n         ○​ D1330 (Oral hygiene instructions)\n         ○​ D1310 (Nutritional counseling)"
},
{
"id": "c063.2",
"section": "PEDS",
"title": "PEDS INITIAL/RECALL — peds initial/recall: note template",
"body": "peds initial/recall: note template\n - y/o female presents to UG Peds with mother for initial/recall appt.\n - RMH with mother. No changes.\n - , no medications, IUTD\n - dental history: brushes 2x a day, flosses 1x a week, mother helps with brushing & flossing\n - caries risk: HIGH\n\n Completed extraoral & intraoral exam:\n - EOE: WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy\n - TMJ: WNL - no deviation, no crepitus, no locking\n - IOE: WNL - no soft tissue pathology, generalized mild gingivitis, generalized moderate plaque\n - oral cancer screening: WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx\n\n Took 4 bitewings & updated odontogram with radiographic & intraoral hard tissue findings:\n - mixed dentition\n -\n - occlusal assessment:\n\n Treatment planned for the following treatments:\n -\n Findings & treatment options, advantages & disadvantages, reviewed with parent. Treatment plan formulated & discussed, all questions were\n answered. Mother signed treatment plan.\n\n Prophy completed.\n - Removed plaque & calculus using hand instruments. Flossed. Polished with prophy paste.\n - Fluoride varnish applied.\n - OHI given; brushing & flossing were demonstrated with mother & pt; advised to brush 2x daily + floss 1x daily\n - Nutritional counseling completed. Advised to limit sugary drinks & snacks, and when consumed, to shorten duration.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c064",
"section": "PEDS",
"title": "SDF (SILVER DIAMINE FLUORIDE)",
"body": "SDF: equipment\n    ●​ in clinic: SDF, dappen dish, microbrush\n    ●​ in unit: cotton rolls, gauze\n\nSDF: steps\n    1.​ OBTAIN INFORMED CONSENT FROM PARENT, INCLUDING SHOWING THE PARENT PICTURES OF SDF\n             ○​ link to pictures of SDF\n    2.​ put 1 drop of SDF in a dappen dish\n    3.​ apply a thick layer of vaseline to lips to prevent skin staining\n    4.​ isolate the tooth (cotton rolls), or retract with your hand if possible\n    5.​ dry the tooth completely using gauze then air\n    6.​ apply SDF to tooth with microbrush — you don’t need a lot of SDF, just a very thin coating will do\n    7.​ wait 60s for SDF to dry\n    8.​ use cotton roll to dry tooth & wipe away remaining wet SDF from tooth\n    9.​ rinse tooth & suction\n\nSDF: note template\n Discussed with parent and patient the disadvantages of SDF, including: staining carious lesions black (showed pictures), possible transient soft\n tissue staining, failure to arrest caries with future need for restoration. Parent understood risks and consented to SDF placement.\n\n Isolated with cotton rolls. Thoroughly dried teeth. Applied SDF to #A in a scrubbing motion. Allowed 60s to air dry. Removed excess SDF & rinsed."
},
{
"id": "c065",
"section": "PEDS",
"title": "SEALANTS",
"body": "sealants\n    ●​ sealants are placed on teeth that are caries free to prevent future caries development\n    ●​ sealants are placed on teeth that have non-cavitated carious lesions limited to enamel to arrest incipient lesions\n\nsealants: equipment\n    ●​ from sterilization: peds restorative kit, curing light, prophy handpiece, patient goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, sealant\n    ●​ in unit: articulating paper, prophy pumice (non-fluoride), prophy angle\n\nsealants: steps\n    1.​ present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today\n              ○​ present your isolation plan (usually Isodry)\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ isolate\n              ○​ Isodry is usually best for sealants (avoids getting pt numb to place rubber dam clamp)\n    5.​ clean the tooth\n              ○​ clean the tooth with pumice (fluoride-free) & a prophy cup\n              ○​ thoroughly dry the tooth\n    6.​ etch & bond\n              ○​ etch: etch enamel → wait 30s → rinse 15s → lightly dry, do not dessicate\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n                      ■​ bonding is optional, decide with faculty if you should bond (they usually want you to)\n    7.​ apply sealant\n              ○​ use included sealant brush, microbrush, or explorer to manipulate the sealant material\n              ○​ sealant material is thick — make sure you don’t apply too much or it will interfere with occlusion\n              ○​ light cure 20s\n    8.​ check for excess\n              ○​ most common area for excess is distal of mandibular molars, near/under gingiva\n    9.​ check occlusion\n              ○​ check occlusion with articulating paper\n    10.​ complete codes & note\n              ○​ D1351 (Sealant - per tooth)\n    11.​ check in — have your instructor check your sealant & swipe your EPR/codes/note\n\nsealants: note template\n - y/o female presents to UG Peds with mother for #3, #14, #19, #30 sealants\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Sealants — #3, #14, #19, #30\n Tooth cleaned with pumice & prophy angle. Isodry placed (size P). Etched with 35% phosphoric acid for 30s, rinsed 15s, gently dried. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit of mandibular molars /\n lingual groove of maxillary molars. Light cured 20s. Repeated for all molars (#2, #3, #14, #15, #18, #19, #30, #31). Occlusion evaluated with\n articulating paper -- occlusion is satisfactory, pt is not occluding on sealant.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c066.0",
"section": "PEDS",
"title": "PRR (PREVENTIVE RESIN RESTORATION) — PRR: equipment",
"body": "PRR: equipment\n    ●​ from sterilization: peds composite kit, handpieces, peds burs, composite finishing burs (not peds), restorative burs (not\n        peds), composite gun, curing light, composite, peds rubber dam kit, nitrous nose, peds goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: anesthetic needle/carpule/shield/topical, rubber dam, wedget, Isodry, etch, ScotchBond, Shofu, articulating paper"
},
{
"id": "c066.1",
"section": "PEDS",
"title": "PRR (PREVENTIVE RESIN RESTORATION) — PRR: steps",
"body": "PRR: steps\n    1.​ present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n    5.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    6.​ complete prep\n              ○​ remove decay with high speed then slow speed burs\n                       ■​ with a slow speed round bur, infected dentin is drilled out looking cheesy & clumpy while healthy dentin is\n                            drilled out looking chalky & dusty — this can help you determine if you have removed all decay\n              ○​ only remove carious enamel & dentin — the point of a PRR is to make the smallest possible preparation\n              ○​ depth is usually 1.0 - 1.5 mm and usually only involves pits (no need to extend into grooves unless cariously\n                  involved)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n    7.​ check in — have instructor check cavity preparation\n    8.​ restore, polish, & adjust\n              ○​ prepare the cavity prep:\n                       ■​ etch: etch enamel first (etch entire occlusal surface to allow sealant placement), then dentin → wait 15s\n                            → rinse & lightly dry, leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry;\n                            dentin should be glossy without pooling)\n                       ■​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n                       ■​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n                       ■​ can often be placed in 1 increment due to small prep size\n                       ■​ cure the final increment for 60s\n              ○​ place a sealant over the composite restoration & cure 20s (10s on high)\n              ○​ remove Isodry / rubber dam → check occlusion\n              ○​ finish & polish\n    9.​ complete codes\n              ○​ D2391 (Resin-based comp - 1 surf, post.)\n              ○​ cannot complete codes for composite & sealant on same tooth, because DHS will not cover both in 1 day\n    10.​ check in — have instructor check final restoration; have instructor swipe your EPR/codes/notes"
},
{
"id": "c066.2",
"section": "PEDS",
"title": "PRR (PREVENTIVE RESIN RESTORATION) — PRR: note template",
"body": "PRR: note template\n - y/o female presents to UG Peds with mother for #A-MO preventative resin restoration\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right/ buccal infiltration #A.\n\n #A-MO PRR\n Placed Isodry (size P). Excavated shallow decay using high & slow speed burs. Prepared cavity preparation to ideal form. Etched with 35%\n phosphoric acid for 15s, rinsed 5s, gently dried. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill\n composite in increments, each cured 20-40s. Applied Ultradent UltraSeal XT Plus to occlusal surface & buccal pit / lingual groove, light cured 20s.\n Restoration finished & polished. Occlusion evaluated with articulating paper & adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c067.0",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS I — indications for composite vs. SSC",
"body": "indications for composite vs. SSC\n     ●​ small carious lesions — less than 50% penetration into dentin\n     ●​ finished preparation contained within line angles of the tooth\n     ●​ no decalcifications or caries that would extend beyond preparation form\n     ●​ limited gingival extent of interproximal caries\n     ●​ no more than one proximal surface involved\n     ●​ no more than 50% of total tooth structure involved\n     ●​ MODs are not placed on primary teeth — teeth with mesial and distal caries are indicated for SSCs\n     ●​ slot preps are not recommended for primary teeth — a small occlusal extension improves success and does not have any\n         long-term negative outcomes for the patient"
},
{
"id": "c067.1",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS I — peds composite — class I: equipment",
"body": "peds composite — class I: equipment\n    ●​ from sterilization: peds restorative kit, composite kit, peds rubber dam kit, handpieces, restorative burs, composite finishing\n        burs, composite gun, curing light, nitrous nose, patient goggles\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, sealant, Shofu, rubber dam, composite, Isodry\n    ●​ in unit: anesthetic needle/carpule/shield/topical, wedget, articulating paper"
},
{
"id": "c067.2",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS I — peds composite — class I: steps",
"body": "peds composite — class I: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ select a shade\n    6.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    7.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n    8.​ check in — have instructor check your prep; refine it until they approve\n    9.​ place liner or base, if indicated\n              ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n    10.​ etch & bond\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    11.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    12.​ apply sealant\n              ○​ seal on top of composite\n              ○​ use included sealant brush, microbrush, or explorer to manipulate the sealant material\n              ○​ sealant material is thick — make sure you don’t apply too much or it will interfere with occlusion\n              ○​ light cure 20s (10s on high)\n    13.​ check occlusion\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n    14.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    15.​ check in — have instructor check your restoration\n    16.​ complete codes & note\n              ○​ D2391 (Resin-based comp - 1 surf, post.)\n    17.​ check in — have instructor swipe your EPR/codes/notes\npeds composite — class I: note template\n - y/o female presents to UG Peds with mother for #A-O composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-O\n Placed Isodry (size P). Removed existing failing O amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation\n to ideal form. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried\n 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c068.0",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS II — indications for composite vs. SSC",
"body": "indications for composite vs. SSC\n     ●​ small carious lesions — less than 50% penetration into dentin\n     ●​ finished preparation contained within line angles of the tooth\n     ●​ no decalcifications or caries that would extend beyond preparation form\n     ●​ limited gingival extent of interproximal caries\n     ●​ no more than one proximal surface involved\n     ●​ no more than 50% of total tooth structure involved\n     ●​ MODs are not placed on primary teeth — teeth with mesial and distal caries are indicated for SSCs\n     ●​ slot preps are not recommended for primary teeth — a small occlusal extension improves success and does not have any\n         long-term negative outcomes for the patient"
},
{
"id": "c068.1",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS II — peds composite — class II: equipment",
"body": "peds composite — class II: equipment\n    ●​ from sterilization: peds restorative kit, composite kit, peds rubber dam kit, handpieces, restorative burs, composite finishing\n        burs, Garrison kit, composite gun, curing light, plastic wedges, sectional matrix, nitrous nose, patient goggles\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, sealant, Shofu, gold matrix band, wooden wedges, rubber dam, composite, Isodry\n    ●​ in unit: anesthetic needle/carpule/shield/topical, wedget, articulating paper"
},
{
"id": "c068.2",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS II — peds composite — class II: steps",
"body": "peds composite — class II: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ select a shade\n    6.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    7.​ pre-wedge\n              ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n    8.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n    9.​ check in — have instructor check your prep; refine it until they approve\n    10.​ place matrix & wedge\n              ○​ place sectional matrix band (smiling toward occlusal) → place plastic wedge → place Garrison ring → burnish\n                       ■​ don’t forget to tie floss to the Garrison ring\n\n                       ■​ you can use 2 Garrison rings for an MOD — or use one Garrison mesially to restore M contact, switch to\n                            distal to restore D contact, then fill occlusal last\n              ○​ or, place gold matrix band, then burnish\n                       ■​ gold matrix band is used in peds, but honestly it sucks and I’d just use a Garrison\n    11.​ place liner or base, if indicated\n              ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                            → cover with Vitrebond (see above)\n    12.​ etch & bond\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    13.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    14.​ apply sealant\n              ○​ seal on top of composite\n              ○​ use included sealant brush, microbrush, or explorer to manipulate the sealant material\n              ○​ sealant material is thick — make sure you don’t apply too much or it will interfere with occlusion\n              ○​ light cure 20s (10s on high)\n    15.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    16.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    17.​ check in — have instructor check your restoration\n    18.​ complete codes & note\n              ○​ D2392 (Resin-based comp - 2 surf, post.)\n              ○​ D2393 (Resin-based comp - 3 surf, post.)\n    19.​ check in — have instructor swipe your EPR/codes/notes\npeds composite — class II: note template\n - y/o female presents to UG Peds with mother for #A-MO composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-MO\n Placed Isodry (size P). Removed existing failing MOD amalgam restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed Garrison system with matrix band & wedge, burnished. / Gold matrix band placed. Etched with 35% phosphoric\n acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel\n nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing diamond burs, polished with Shofu & Jiffy\n brush. Evaluated interproximal contact with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c069.0",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS III — indications for composite vs. SSC",
"body": "indications for composite vs. SSC\n     ●​ small carious lesions — less than 50% penetration into dentin\n     ●​ finished preparation contained within line angles of the tooth\n     ●​ no decalcifications or caries that would extend beyond preparation form\n     ●​ limited gingival extent of interproximal caries\n     ●​ no more than one proximal surface involved\n     ●​ no more than 50% of total tooth structure involved\n     ●​ MODs are not placed on primary teeth — teeth with mesial and distal caries are indicated for SSCs\n     ●​ slot preps are not recommended for primary teeth — a small occlusal extension improves success and does not have any\n         long-term negative outcomes for the patient"
},
{
"id": "c069.1",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS III — peds composite — class III: equipment",
"body": "peds composite — class III: equipment\n    ●​ from sterilization: peds restorative kit, composite kit, peds rubber dam kit, handpieces, restorative burs, composite finishing\n        burs, composite gun, curing light, Vita shade guide, nitrous nose, patient goggles\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, Shofu, clear mylar strip, wooden wedges, rubber dam, composite, Isodry\n             ○​ from UG adult clinic: finishing strips, #12 scalpel\n    ●​ in unit: anesthetic needle/carpule/shield/topical, wedget, articulating paper"
},
{
"id": "c069.2",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS III — peds composite — class III: steps",
"body": "peds composite — class III: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ select a shade\n    6.​ isolate\n              ○​ you can use Isodry (depending on tooth location; sometimes Isodry interferes with anterior teeth)\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    7.​ pre-wedge\n              ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n    8.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n              ○​ usually accessed from the facial because caries are usually on the facial & access is easier\n                       ■​ can be accessed from lingual if caries is on the lingual\n              ○​ create initial prep into the interproximal (like a class II box) & extend to completely remove caries\n\n              ○​ make an extension onto the facial (or lingual) to increase retention\n                       ■​ the facial extension should be 1 mm deep if there are no caries\n                       ■​ the margin of the facial extension should be beveled — create a wide bevel (0.5 to 2.0 mm) to maximize\n                            esthetics & retention\n              ○​ 2 adjacent lesions: prepare larger lesion → prepare smaller lesion → restore smaller lesion → restore larger lesion\n    9.​ check in — have instructor check your prep; refine it until they approve\n    10.​ place matrix & wedge\n              ○​ place clear mylar strip + wooden wedge\n    11.​ place liner or base, if indicated\n              ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                            → cover with Vitrebond (see above)\n    12.​ etch & bond\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    13.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    14.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    15.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    16.​ check in — have instructor check your restoration\n    17.​ complete codes & note\n              ○​ D2330 (Resin-based comp - 1 surf, ant.)\n              ○​ D2331 (Resin-based comp - 2 surf, ant.)\n              ○​ D2332 (Resin-based comp - 3 surf, ant.)\n    18.​ check in — have instructor swipe your EPR/codes/notes\npeds composite — class III: note template\n - y/o female presents to UG Peds with mother for #E-MF composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-MF\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c070.0",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS IV — indications for composite vs. SSC",
"body": "indications for composite vs. SSC\n     ●​ small carious lesions — less than 50% penetration into dentin\n     ●​ finished preparation contained within line angles of the tooth\n     ●​ no decalcifications or caries that would extend beyond preparation form\n     ●​ limited gingival extent of interproximal caries\n     ●​ no more than one proximal surface involved\n     ●​ no more than 50% of total tooth structure involved\n     ●​ MODs are not placed on primary teeth — teeth with mesial and distal caries are indicated for SSCs\n     ●​ slot preps are not recommended for primary teeth — a small occlusal extension improves success and does not have any\n         long-term negative outcomes for the patient"
},
{
"id": "c070.1",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS IV — peds composite — class IV: equipment",
"body": "peds composite — class IV: equipment\n    ●​ from sterilization: peds restorative kit, composite kit, peds rubber dam kit, handpieces, restorative burs, composite finishing\n        burs, composite gun, curing light, Vita shade guide, nitrous nose, patient goggles\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, Shofu, clear mylar strip, wooden wedges, finishing strips, rubber dam, composite, Isodry\n             ○​ from UG adult clinic: #12 scalpel, Cosmedent discs\n    ●​ in unit: anesthetic needle/carpule/shield/topical, wedget, articulating paper"
},
{
"id": "c070.2",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS IV — peds composite — class IV: steps",
"body": "peds composite — class IV: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ select a shade\n    6.​ isolate\n              ○​ you can use Isodry (depending on tooth location; sometimes Isodry interferes with anterior teeth)\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    7.​ pre-wedge\n              ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n    8.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n              ○​ create a wide bevel (0.5 to 2.0 mm) to maximize esthetics & retention\n              ○​ 2 adjacent lesions: prepare larger lesion → prepare smaller lesion → restore smaller lesion → restore larger lesion\n    9.​ check in — have instructor check your prep; refine it until they approve\n\n    10.​ place matrix & wedge\n              ○​ place clear mylar strip + wooden wedge\n    11.​ place liner or base, if indicated\n              ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                            → cover with Vitrebond (see above)\n    12.​ etch & bond\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    13.​ place composite\n              ○​ place composite in increments & cure 20-40s after each increment (depending on increment size)\n              ○​ cure the final increment for 60s\n    14.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper\n              ○​ check interproximal contact with floss\n    15.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    16.​ check in — have instructor check your restoration\n    17.​ complete codes & note\n              ○​ D2335 (Resin-based comp - 4+ surf, ant.)\n    18.​ check in — have instructor swipe your EPR/codes/notes\npeds composite — class IV: note template\n - y/o female presents to UG Peds with mother for #E-MIFL composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-MIFL\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Prepared cavity\n preparation to ideal form. Placed clear mylar strip & wedge. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist.\n Applied Scotchbond Universal 20s, air dried 5s, cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s\n final cure. Finished restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact\n with floss, adjusted to ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c071.0",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS V — indications for composite vs. SSC",
"body": "indications for composite vs. SSC\n     ●​ small carious lesions — less than 50% penetration into dentin\n     ●​ finished preparation contained within line angles of the tooth\n     ●​ no decalcifications or caries that would extend beyond preparation form\n     ●​ limited gingival extent of interproximal caries\n     ●​ no more than one proximal surface involved\n     ●​ no more than 50% of total tooth structure involved\n     ●​ MODs are not placed on primary teeth — teeth with mesial and distal caries are indicated for SSCs\n     ●​ slot preps are not recommended for primary teeth — a small occlusal extension improves success and does not have any\n         long-term negative outcomes for the patient"
},
{
"id": "c071.1",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS V — peds composite — class V: equipment",
"body": "peds composite — class V: equipment\n    ●​ from sterilization: peds restorative kit, composite kit, peds rubber dam kit, handpieces, restorative burs, composite finishing\n        burs, composite gun, curing light, Vita shade guide, nitrous nose, patient goggles\n    ●​ from locker: blood pressure cuff, loupes and/or eye protection\n    ●​ in clinic: etch, ScotchBond, Shofu, rubber dam, composite, Isodry\n    ●​ in unit: anesthetic needle/carpule/shield/topical, wedget"
},
{
"id": "c071.2",
"section": "PEDS",
"title": "PEDS COMPOSITE — CLASS V — peds composite — class V: steps",
"body": "peds composite — class V: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ select a shade\n    6.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    7.​ pre-wedge\n              ○​ place wooden wedges before prepping to expand PDL; makes restoring a contact easier\n    8.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n              ○​ create a wide bevel (0.5 to 2.0 mm) to maximize esthetics & retention\n    9.​ check in — have instructor check your prep; refine it until they approve\n    10.​ place liner or base, if indicated\n              ○​ liner:\n\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                           to pulpal floor → light cure 20s\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above)\n              ○​ Sandwich technique:\n                       ■​ do not etch or bond\n                       ■​ use a microbrush to apply RMGI cavity conditioner to the preparation for 15s → lightly air dry without\n                           water (!) → light cure 10s\n                       ■​ apply Ketac Nano (RMGI) as bottom layer of “sandwich” — similar to applying a base underneath\n                           composite\n                       ■​ light cure 10s on high\n                       ■​ then: etch, bond, & place composite like normal\n    11.​ etch & bond\n              ○​ etch: etch enamel first, then dentin → wait 15s → rinse 5s → lightly dry, leaving dentin moist (use high-evacuation\n                  suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n              ○​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n              ○​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n    12.​ place composite\n              ○​ place composite in increments & cure 40s after each increment (20s on high)\n    13.​ finish & polish\n              ○​ composite finishing burs, Shofu, Jiffy Brush\n    14.​ check in — have instructor check your restoration\n    15.​ complete codes & note\n              ○​ D2330 (Resin-based comp - 1 surf, ant.)\n              ○​ D2391 (Resin-based comp - 1 surf, post.)\n    16.​ check in — have instructor swipe your EPR/codes/notes\npeds composite — class V: note template\n - y/o female presents to UG Peds with mother for #E-B composite\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 60 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #E-B\n Placed Isodry (size P). Removed existing failing B RMGI restoration. Excavated decay using high & slow speed burs. Prepared cavity preparation to\n ideal form. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied Scotchbond Universal 20s, air dried 5s,\n cured 10s. Applied shade A2 Renamel nanofill composite in increments, each cured 20s, with 40s final cure. Finished restoration with finishing\n diamond burs, polished with Shofu & Jiffy brush.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c072.0",
"section": "PEDS",
"title": "PEDS AMALGAM — peds amalgam: equipment",
"body": "peds amalgam: equipment\n    ●​ from sterilization: peds restorative kit, peds rubber dam kit, handpieces, restorative burs, composite finishing burs, nitrous\n       nose, peds goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: Isodry, amalgamator, rubber dam, wedget, wedge, gold matrix band, amalgam capsules, articulating paper, floss\n    ●​ in unit: anesthetic needle/carpule/shield/topical"
},
{
"id": "c072.1",
"section": "PEDS",
"title": "PEDS AMALGAM — peds amalgam: steps",
"body": "peds amalgam: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a SSC and/or pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    6.​ complete prep\n              ○​ a slow speed round bur is more conservative (less powerful) than a spoon excavator when removing decay\n              ○​ with a slow speed round bur, infected dentin is drilled out looking wet, cheesy, & clumpy while healthy dentin is\n                  drilled out looking dry, chalky, & dusty — this can help you determine if you have removed all decay\n              ○​ if removing an existing composite, you can tell the difference between composite & tooth by thoroughly drying or\n                  scratching with an explorer (composite scratches, tooth does not)\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n              ○​ don’t forget that amalgam preparations have specific parameters\n                       ■​ convergent buccal & lingual walls\n                       ■​ parallel or slightly divergent proximal walls\n                       ■​ at least 1.5 mm deep; deeper prep if decay extends deeper\n                       ■​ flat pulpal floor with rounded line angles & beveled axiopulpal walls\n                       ■​ no unsupported enamel\n                       ■​ does not undermine marginal ridges\n    7.​ check in — have instructor check your prep\n    8.​ place matrix & wedge\n              ○​ place Tofflemire retainer + universal matrix band + wooden wedge, then burnish\n              ○​ the closed end of the Tofflemire retainer goes toward the occlusal surface of the teeth\n              ○​ the matrix band should be narrower gingivally & wider occlusally\n    9.​ place liner or base, if indicated\n              ○​ liner:\n                       ■​ indication: when remaining dentin thickness is too thin to prevent bacterial insult to the pulp\n                       ■​ placement: dispense Vitrebond (RMGI) onto mixing pad → mix with spatula → apply thin layer (0.5 mm)\n                            to pulpal floor → light cure 20s → apply gluma afterward (see below)\n              ○​ base:\n                       ■​ indication: indirect pulp cap in the area of pulpal proximity, or small mechanical (not carious) exposure\n\n                       ■​ placement: apply Dycal (calcium hydroxide) only to area of pulpal proximity or mechanical pulpal exposure\n                           → cover with Vitrebond (see above) → apply gluma afterward (see below)\n    10.​ place sealer (Gluma)\n              ○​ sealers (Gluma) are always indicated under amalgam restorations\n              ○​ apply a very thin layer of Gluma in a scrubbing motion for 45s → wait 15s → air dry → rinse 15s → lightly dry,\n                  leaving dentin moist (use high-evacuation suction over tooth & lightly quickly air dry; dentin should be glossy\n                  without pooling)\n    11.​ deliver & condense amalgam\n              ○​ depress amalgam plunger on capsule & amalgamate capsule for 9-12s on medium speed (3600 cpm)\n                       ■​ open capsule & empty amalgam into amalgam well\n                       ■​ evaluate mix — should look consistent, shiny, & smooth (poor mix looks dull, crumbly, or dry)\n              ○​ use the amalgam carrier to deliver amalgam from the amalgam well to the prepared tooth\n                       ■​ overfill the preparation; cavosurface margins should be well covered\n              ○​ condense the amalgam\n                       ■​ first, use small condenser with adequate pressure over pulpal wall & into preparation line angles\n                       ■​ next, use large condenser to condense the entire preparation\n                       ■​ use high speed suction to remove excess amalgam\n              ○​ use large ball burnisher to sweep across the restoration to remove excess amalgam; establish the right contour\n                  (fossa and ridges), generally, while continuing to condense the amalgam\n              ○​ use 5T for initial carving, keeping the carving surface on both the tooth and restoration to expose margins\n              ○​ use Cleoid-Discoid, ½ Hollenback, and anatomic burnisher to carve anatomy\n              ○​ smooth the surface with a wet cotton roll once mostly set\n    12.​ check occlusion & contact\n              ○​ remove rubber dam / isodry\n              ○​ check occlusion with articulating paper — be careful! if the patient bites really hard it can fracture the amalgam\n                       ■​ if occlusion is high, adjust with a high-speed bur gently (you don’t want to fracture the amalgam)\n              ○​ check interproximal contact with floss\n    13.​ check in\n              ○​ have instructor check your restoration\n    14.​ complete codes & note\n              ○​ code for amalgam:\n                       ■​ D2140 (Amalgam - 1 surface)\n                       ■​ D2150 (Amalgam - 2 surfaces)\n                       ■​ D2160 (Amalgam - 3 surfaces)\n                       ■​ D2161 (Amalgam - 4 or more surfaces)\n    15.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c072.2",
"section": "PEDS",
"title": "PEDS AMALGAM — peds amalgam: note template",
"body": "peds amalgam: note template\n - y/o female presents to UG Peds with mother for #A-O amalgam\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A-O\n Placed Isodry (size P). Completely removed failing existing O amalgam restoration and excavated decay using high & slow speed burs. Prepared\n cavity preparation to ideal form. Applied Gluma in scrubbing motion for 10s then rinsed thoroughly. Placed gold matrix band. Delivered,\n overfilled, & condensed amalgam. Removed excess & carved amalgam to ideal anatomic form. Interproximal contact evaluated with floss &\n adjusted to ideal. Occlusion evaluated with articulating paper & adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Mother was informed that patient is still numb & to\n monitor lip and soft tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c073.0",
"section": "PEDS",
"title": "STAINLESS STEEL CROWN (SSC) — indications for SCC vs. composite",
"body": "indications for SCC vs. composite\n     ●​ caries involving 3+ surfaces (including buccal & lingual)\n     ●​ interproximal caries extending beyond the line angles\n              ○​ large proximal caries also have high failure rates when treated with intracoronal restorations\n     ●​ recurrent caries on class II restorations\n              ○​ small primary teeth have much higher risk of pulp exposure on second restoration\n     ●​ large 1-2 surface caries, especially if there is significant time left until exfoliation or if the patient is extremely high risk\n     ●​ teeth requiring pulp therapy\n              ○​ primary pulp therapy is much more successful with full coverage restorations rather than intracoronal restorations"
},
{
"id": "c073.1",
"section": "PEDS",
"title": "STAINLESS STEEL CROWN (SSC) — SSC: equipment",
"body": "SSC: equipment\n    ●​ from sterilization: peds restorative kit, peds band & crown kit, peds rubber dam kit, radiograph kit, handpieces, peds burs,\n        restorative burs, composite finishing burs, nitrous nose, peds goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: Isodry, stainless steel crown kit, Dexis or Gendex kit, rubber dam, wedget, articulating paper, floss, FujiCem + tip,\n        microbrushes\n    ●​ in unit: anesthetic topical/needle/shield/carpule"
},
{
"id": "c073.2",
"section": "PEDS",
"title": "STAINLESS STEEL CROWN (SSC) — SSC: steps",
"body": "SSC: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ isolate\n              ○​ you can use Isodry\n              ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    6.​ complete prep\n              ○​ first, reduce occlusion with diamond football bur\n                       ■​ 1.5 - 2.0 mm occlusal clearance from opposing tooth\n                       ■​ maintain the general occlusal anatomy\n              ○​ reduce the interproximals with knife-edge finish line (no shoulder, no ledge)\n                       ■​ 0.5 mm of interproximal clearance — explorer should easily pass\n                       ■​ proximal reduction should converge 4-10° total (2-5° per side)\n                       ■​ proximal reduction should follow tooth form (rounded)\n                       ■​ knife-edge finish line should be at gingival margin or slightly subgingival\n                       ■​ buccal & lingual reduction is usually not indicated (except for decay removal) — ask instructor\n              ○​ bevel the buccal & lingual and round sharp corners/edges\n                       ■​ 30-40° bevel is ideal\n                       ■​ the reason for the bevel is to return the cusp tips to their original position after occlusal reduction\n              ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n\n    7.​ fit SSC\n              ○​  if Isodry or rubber dam is not in place: place a throat pack / use gauze to prevent swallowing or aspiration\n              ○​  select a stainless steel crown from the kit that approximates the anatomy & size of the tooth\n              ○​  seat the crown on lingual then roll/snap to buccal — fit should be really tight and require a lot of pressure to seat\n              ○​  for permanent teeth only (not primary teeth):remove the crown then use scissors to trim the crown\n              ○​  use contouring pliers to crimp the crown (adapt crown to tooth under gingival margin)\n              ○​  stainless steel crowns are not adjustable, so you are limited in fine-tuning occlusion\n                        ■​ the pediatric dentition is adaptable to changes in occlusion of less than 0.5 mm\n    8.​ check in — have instructor check crown preparation & crown fit\n    9.​ for permanent teeth only (not primary teeth): take a bitewing\n             ○​ take a bitewing radiograph with the SSC in place (before cementing) to evaluate the fit/extension/margins\n             ○​ no need to take BW for primary tooth SSCs\n    10.​ check in — have instructor check bitewing\n    11.​ cement SSC\n             ○​ fill crown 80% with FujiCem\n             ○​ seat lingual & roll to buccal\n             ○​ have patient bite on bite stick to fully seat crown\n             ○​ remove excess cement with microbrushes or wet cotton rolls/pellets\n             ○​ floss\n             ○​ have patient bite on cotton roll for 3 minutes\n    12.​ check in — have instructor check your restoration\n    13.​ complete codes & note\n             ○​ D2930 (Prefab SS crown -- prim. tooth)\n             ○​ D2931 (Prefab SS crown -- perm. tooth)\n    14.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c073.3",
"section": "PEDS",
"title": "STAINLESS STEEL CROWN (SSC) — SSC: note template",
"body": "SSC: note template\n - y/o female presents to UG Peds with mother for #A SSC\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A SSC\n Placed bite block & rubber dam / Isodry placed (size P). Completely removed failing existing MOD composite restoration & excavated D decay\n using high & slow speed burs. Completed crown prep to ideal form. Tried on SSC #5; trimmed & crimped to ideal fit. Confirmed occlusion.\n Confirmed crown margins with BW radiograph. Cemented crown with GIC FujiCEM & seated using a bite stick. Excess cement cleaned, flossed.\n Re-confirmed occlusion.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c074.0",
"section": "PEDS",
"title": "PULPOTOMY — notes",
"body": "notes\n    ●​ pulpotomies are performed on vital or inflamed pulps (reversible pulpitis, irreversible pulpitis)\n            ○​ teeth with necrotic pulp are indicated for extraction\n    ●​ indirect pulp caps have good success in pediatric teeth\n    ●​ direct pulp caps are contraindicated in pediatric teeth; pulpotomy is indicated upon pulpal exposure\n    ●​ indications for pulpotomy:\n            ○​ vital pulp with carious exposure\n            ○​ small mechanical exposure\n            ○​ solicited pain with large carious lesion\n    ●​ contraindications for pulpotomy:\n            ○​ history of spontaneous pain\n            ○​ presence of soft tissue swelling\n            ○​ excessive bleeding from orifices following procedure\n            ○​ necrotic pulp\n            ○​ existing furcation radiolucency or root resorption"
},
{
"id": "c074.1",
"section": "PEDS",
"title": "PULPOTOMY — pulpotomy: equipment",
"body": "pulpotomy: equipment\n    ●​ from sterilization: peds restorative kit, peds band & crown kit, peds rubber dam kit, radiograph kit, handpieces, peds burs,\n       restorative burs, composite finishing burs, endo burs, nitrous nose, peds goggles\n    ●​ from locker: loupes and/or eye protection\n    ●​ in clinic: stainless steel crown kit, Dexis or Gendex kit, rubber dam, wedget, articulating paper, floss, Viscostat, IRM (powder\n       + liquid), mixing pad, FujiCem + tip, microbrushes\n    ●​ in unit: anesthetic topical/needle/shield/carpule, cotton pellets, cotton applicator"
},
{
"id": "c074.2",
"section": "PEDS",
"title": "PULPOTOMY — pulpotomy: steps",
"body": "pulpotomy: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ warn the guardian that if the cavity is deep or bigger than expected, a pulpotomy may be required\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ administer nitrous oxide, if planned\n    4.​ give local anesthetic\n              ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n              ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n    5.​ isolate\n              ○​ use a rubber dam for pulpotomies (no Isodry!) — don’t forget to tie floss to the clamp\n              ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n    6.​ excavate decay & complete pulpotomy\n              ○​ the coronal pulp is accessed via the occlusal table of the tooth\n              ○​ the outline of the pulp chamber should be prepared down until the pulp is exposed\n                      ■​ use the most prominent pulp horn as a guide\n                      ■​ generally a 330 bur is appropriate until initial exposure\n              ○​ completely remove all caries\n              ○​ the pulp chamber should be completely unroofed so that the entire pulp chamber can be visualized\n                      ■​ a fissure bur (169, 55, 56, straight diamond) is appropriate for unroofing\n\n           ○​ coronal pulp tissue is carefully removed; a slow-speed round bur or spoon excavator can be used to remove the\n               coronal pulp\n                    ■​ slow-speed round bur technique: round bur is placed on the chamber floor without rotating → slightly lift\n                         the bur then begin rotating to protect the chamber floor → move the bur laterally & coronally, not apically\n                    ■​ spoon excavator technique: there is a greater chance of dislodging radicular tissues with the spoon,\n                         however there is a lower chance of perforation\n           ○​ the chamber floor should be clearly visible with no residual tissue\n                    ■​ completely removed pulp may still bleed, but it is limited to the orifices\n                    ■​ the chamber is completely opened and there is straight line access\n           ○​ achieve hemostasis:\n                    ■​ plug the pulp chamber with cotton pellets soaked in saline\n                    ■​ important! — check to see if hemostasis is achieved now; it should be! if you remove wet cotton pellets\n                         and pulp is still profusely bleeding, you likely haven’t removed all of the coronal pulp tissue or the\n                         radicular pulp is inflamed/infected and the tooth will likely require complete pulpectomy\n                    ■​ next, plug the pulp chamber with a cotton pellet soaked in Viscostat (unit-dose syringes in clinic)\n7.​ check in — have instructor check pulpotomy\n8.​ place IRM\n           ○​ restore the pulp chamber with IRM approximately up to the level of the preparation\n                    ■​ IRM should be well adapted to the floor to completely seal the chamber\n           ○​ use a wet cotton applicator to adapt IRM\n9.​ check in — have instructor check IRM placement\n10.​ complete SSC prep\n           ○​ first, reduce occlusion with diamond football bur\n                    ■​ 1.5 - 2.0 mm occlusal clearance from opposing tooth\n                    ■​ maintain the general occlusal anatomy\n           ○​ reduce the interproximals with knife-edge finish line (no shoulder, no ledge)\n                    ■​ 0.5 mm of interproximal clearance — explorer should easily pass\n                    ■​ proximal reduction should converge 4-10° total (2-5° per side)\n                    ■​ proximal reduction should follow tooth form (rounded)\n                    ■​ knife-edge finish line should be at gingival margin or slightly subgingival\n                    ■​ buccal & lingual reduction is usually not indicated (except for decay removal) — ask instructor\n           ○​ bevel the buccal & lingual and round sharp corners/edges\n                    ■​ 30-40° bevel is ideal\n                    ■​ the reason for the bevel is to return the cusp tips to their original position after occlusal reduction\n           ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n11.​ fit SSC (do not cement)\n           ○​ place a throat pack / use gauze to prevent swallowing or aspiration\n           ○​ select a stainless steel crown from the kit that approximates the anatomy & size of the tooth\n           ○​ seat the crown on the lingual then roll/snap to the buccal\n                    ■​ you want a super tight fit so it’ll require a lot of pressure to get the crown to seat\n           ○​ remove the crown then use contouring pliers to crimp the crown (adapt crown to tooth under gingival margin)\n           ○​ stainless steel crowns are not adjustable, so you are limited in fine-tuning occlusion\n                    ■​ the pediatric dentition is adaptable to changes in occlusion of less than 0.5 mm\n12.​ check in — have instructor check crown preparation & crown fit\n13.​ cement SSC\n           ○​ fill crown 80% with FujiCem\n           ○​ seat lingual & roll to buccal\n           ○​ have patient bite on bite stick to fully seat crown\n           ○​ remove excess cement with microbrushes\n           ○​ floss\n           ○​ have patient bite on cotton roll for 3 minutes\n14.​ check in — have instructor check your restoration\n15.​ complete codes & note\n           ○​ D3230 (Ant -- primary tooth)\n           ○​ D3240 (Post -- primary tooth)\n           ○​ D2930 (Prefab SS crown -- prim. tooth)\n16.​ check in — have instructor check final restoration\n           ○​ have instructor swipe your EPR/codes/note"
},
{
"id": "c074.3",
"section": "PEDS",
"title": "PULPOTOMY — pulpotomy: note template",
"body": "pulpotomy: note template\n - y/o female presents to UG Peds with mother for #A pulpotomy & SSC\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block on right / buccal infiltration #A.\n\n #A pulpotomy\n Placed bite block & rubber dam. Completely removed failing existing MOD composite restoration and excavated decay using high & slow speed\n burs. Pulp chamber accessed & unroofed completely. Amputated coronal pulp tissue. Hemostasis achieved via moist cotton pellet followed by\n Viscostat for 10s & thorough rinsing. Hemostasis confirmed. IRM placed.\n\n #A-SSC\n Completed crown prep to ideal form. Tried on SSC #5; trimmed & crimped to ideal fit. Confirmed occlusion. Cemented crown with GIC FujiCEM &\n seated using a bite stick. Excess cement cleaned, flossed. Re-confirmed occlusion.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c075.0",
"section": "PEDS",
"title": "STRIP CROWN — strip crown: equipment",
"body": "strip crown: equipment\n     ●​ from sterilization: peds restorative kit, peds rubber dam kit, handpieces, peds burs, restorative burs, composite finishing\n         burs, composite gun, curing light, Vita shade guide, nitrous nose, peds goggles\n     ●​ from locker: loupes and/or eye protection\n     ●​ in clinic: Isodry, rubber dam, wedget, composite, etch, ScotchBond, Shofu, enamelize, articulating paper, floss\n              ○​ in UG adult clinic: discs, finishing strips, #12 scalpel\n     ●​ in unit: anesthetic needle/carpule/shield/topical"
},
{
"id": "c075.1",
"section": "PEDS",
"title": "STRIP CROWN — strip crown: steps",
"body": "strip crown: steps\n     1.​ check in — present patient to instructor\n               ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n               ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n               ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n               ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n               ○​ present your isolation plan\n               ○​ other things to mention: how recent is treatment plan, date of last radiographs\n     2.​ call your patient in\n               ○​ go find your pt & guardian in the waiting room\n               ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n               ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n               ○​ warn the guardian that if the cavity is deep or bigger than expected, a pulpotomy may be required\n               ○​ leave guardian in waiting room & bring patient back\n               ○​ weigh the pt\n     3.​ administer nitrous oxide, if planned\n     4.​ give local anesthetic\n               ○​ 1 carpule is the limit — check with instructor before delivering more than 1 carpule\n               ○​ use the short (blue) needle, even for IANs (unless pt is an older/bigger teenager)\n     5.​ select shade\n     6.​ isolate\n               ○​ you can use Isodry (depending on tooth location; sometimes Isodry interferes with anterior teeth)\n               ○​ if using a rubber dam, don’t forget to tie floss to the clamp\n               ○​ instead of several holes, punch 2 holes ½ inch apart & use scissors to cut between — allows quick placement\n     7.​ complete prep\n               ○​ reduce the interproximals with knife-edge finish line (no shoulder, no ledge)\n                        ■​ interproximal reduction should be 1 mm\n                        ■​ proximal reduction should converge 4-10° total (2-5° per side)\n                        ■​ proximal reduction should follow tooth form\n                        ■​ knife-edge finish line should be at gingival margin or slightly subgingival\n               ○​ reduce the facial surface with knife-edge finish line (no shoulder, no ledge)\n                        ■​ facial reduction should be 1 mm\n                        ■​ facial reduction should follow tooth form\n                        ■​ knife-edge finish line should be at gingival margin or slightly subgingival\n               ○​ reduce the lingual surface to allow room for restoration\n                        ■​ lingual surface should have 0.5 mm clearance from opposing tooth\n               ○​ reduce the incisal edge\n                        ■​ incisal edge reduction should be 1.5 mm\n                        ■​ incisal corners should be rounded\n               ○​ if caries is larger than expected or if you are close to the pulp, check with instructor\n     8.​ fit crown form\n               ○​ select the correct shape & size of crown form\n               ○​ use scissors to trim the crown form to the correct dimension\n               ○​ achieve ideal fit\n               ○​ if you cannot get the crown form to fit, you will likely need to further reduce the tooth (even if it is already ideal)\n     9.​ check in — have instructor check crown preparation & crown fit\n     10.​ place strip crown\n               ○​ etch & bond\n\n                      ■​ etch: etch enamel first, then dentin → wait 15s → rinse & lightly dry, leaving dentin moist (use\n                          high-evacuation suction over tooth & lightly quickly air dry; dentin should be glossy without pooling)\n                      ■​ bond: apply ScotchBond in a vigorous scrubbing motion for 20s → air thin for 5s → light cure 10s\n                      ■​ if contaminated: re-etch for only 5s, then proceed as usual (rinse, dry, bond, dry, cure)\n             ○​ load composite into crown form\n             ○​ seat crown form onto tooth, remove excess composite\n             ○​ light cure 40s\n             ○​ remove crown form\n             ○​ finish & polish\n                      ■​ it is especially important to finish & polish the gingival margins\n    11.​ check occlusion\n             ○​ the restoration should not be in occlusion, protrusion, or lateral movements\n    12.​ complete codes & note\n             ○​ D2390 (Resin-based comp crown, ant.)\n    13.​ check in — have instructor swipe your EPR/codes/notes"
},
{
"id": "c075.2",
"section": "PEDS",
"title": "STRIP CROWN — strip crown: note template",
"body": "strip crown: note template\n - y/o female presents to UG Peds with mother for #F composite strip crown\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n Titrated to 40% nitrous oxide / 60% oxygen at 4L/min. Administered for 90 minutes. Applied 20% topical benzocaine & administered 1 carpule of\n 2% lidocaine 1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal block / buccal infiltration #F.\n\n #F composite strip crown\n Placed Isodry (size P). Removed existing failing ML composite restoration. Excavated decay using high & slow speed burs. Completed crown prep to\n ideal form. Strip crown selected & fitted to tooth. Etched with 35% phosphoric acid for 15s, rinsed 5s, gently dried leaving dentin moist. Applied\n Scotchbond Universal 20s, air dried 5s, cured 10s. Loaded shade A2 Renamel nanofill into strip crown, seated crown, cured 60s. Finished\n restoration with finishing diamond burs, polished with Shofu, Jiffy brush, Cosmedent discs. Evaluated interproximal contact with floss, adjusted to\n ideal. Evaluated occlusion with articulating paper, adjusted to ideal.\n\n Patient given 100% oxygen at 4L/min for 5 minutes. Patient released in good condition. Informed mother that pt is still numb, monitor lip & soft\n tissue biting.\n\n - behavior: F4 --\n - NV: 6 month recall\n - Sarah Swade / Dr."
},
{
"id": "c076.1",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer impression: equipment",
"body": "space maintainer impression: equipment\n    ●​ from sterilization: peds restorative kit, peds band & crown kit, nitrous nose, peds goggles\n    ●​ from locker: loupes and/or eye protection, mixing bowl, spatula\n    ●​ in clinic: floss, band kit, alginate, water cylinder, impression trays, alginate spray adhesive, staples"
},
{
"id": "c076.2",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer impression: steps",
"body": "space maintainer impression: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ fit the band\n              ○​ tie floss to every band you try in\n              ○​ band should fit snugly and have minimal open space between tooth structure & band\n              ○​ bands should be seated below the marginal ridges to prevent interference with occlusion\n              ○​ there should be sufficient band supragingivally to allow soldering\n              ○​ it can be difficult to seat bands past contact points, so bite sticks or band pushers can be used to help with seating\n    4.​ check in — have instructor check band fit\n    5.​ take a pick-up impression\n              ○​ the impression can be limited to a single quadrant if a unilateral space maintainer is being fabricated\n              ○​ opposing arches are typically not necessary\n              ○​ after taking the impression, remove the band from the patient’s tooth\n                       ■​ band-removing pliers should be used at all times to minimize gingival trauma & pressure on the tooth\n                       ■​ a squeezing motion (no torquing) will remove even cemented bands\n              ○​ place the band into the impression, oriented correctly, then fix it in place with a staple\n    6.​ mark the code D15XX in progress (I)\n    7.​ check in — have instructor check impression & swipe EPR/codes/notes"
},
{
"id": "c076.3",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer impression: note template",
"body": "space maintainer impression: note template\n - y/o female presents to UG Peds with mother for band & loop impression\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n #36 band fit to #30 with band seater. Pick-up impression taken in alginate.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr.\n\nin the lab: fabricating space maintainer\n     1.​ pour cast with band in place in impression\n     2.​ trim the cast & use a bur to expose the band\n     3.​ follow instructions in Peds Lab Manual to fabricate appropriate space maintainer\n\nsoldering\n\n    ●​ technique:\n            ○​ clean the surface\n            ○​ use flux\n            ○​ ensure that the metal parts to be joined are in close tight contact\n            ○​ use the correct amount of heat to melt the solder to the metal parts\n                     ■​ under-heating results in poor flow & overheating results in pitting\n            ○​ solder only moves where flux is applied\n            ○​ a proper solder flame is blue, clean, & medium in length\n            ○​ heat the metal to he soldered to a dull red; the flux should boil\n            ○​ dip solder into the flux; when heated properly, begin feeding solder into the joint above & below, from the opposite\n                direction of the flame\n            ○​ solder will become liquid & will flow to the hottest portion\n            ○​ gently move the flame back and forth to draw solder to all places, thoroughly coating the joint\n    ●​ polishing:\n            ○​ remove the appliance from the model\n            ○​ perform initial reduction with heatless mizzy & green stone\n            ○​ polish with white stone to achieve satin finish\n            ○​ brown (red) and green points can be used to polish\n\n2nd appointment: delivery"
},
{
"id": "c076.4",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer delivery: equipment",
"body": "space maintainer delivery: equipment\n    ●​ from sterilization: peds restorative kit, peds band & crown kit, prophy handpiece, nitrous nose, peds goggles\n    ●​ from locker: loupes and/or eye protection, cast & space maintainer\n    ●​ in clinic: prophy angle, pumice (non-fluoride), FujiCem + tip, microbrushes"
},
{
"id": "c076.5",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer delivery: steps",
"body": "space maintainer delivery: steps\n    1.​ check in — present patient to instructor\n              ○​ you present the patient to your instructor before you call them in / sit them in the chair (!)\n              ○​ present your patient: patient age, gender, medical history, significant dental history, patient behavior\n              ○​ present your restorative plan: procedure(s) for today, sequence (multiple teeth), etc.\n              ○​ present your anesthesia plan: what anesthetic, type of injection (where), how much anesthetic, nitrous oxide\n              ○​ present your isolation plan\n              ○​ other things to mention: how recent is treatment plan, date of last radiographs\n    2.​ call your patient in\n              ○​ go find your pt & guardian in the waiting room\n              ○​ ask the guardian if anything has changed (med history, medications, allergies, etc.)\n              ○​ explain to the guardian what you’re going to do today & how long they can expect to wait\n              ○​ leave guardian in waiting room & bring patient back\n              ○​ weigh the pt\n    3.​ try in space maintainer\n              ○​ tie floss to small band & loops to prevent swallowing/aspiration\n              ○​ try the space maintainer in — it should fit in the mouth as it does on the cast\n              ○​ a band seater may be required to fully seat the band(s)\n    4.​ evaluate occlusion\n              ○​ ensure the pt is not occluding on the space maintainer; it may be helpful to evaluate occlusion with the space\n                  maintainer out and then in\n    5.​ clean the tooth\n              ○​ clean the abutment tooth with pumice & prophy angle\n    6.​ cement space maintainer\n              ○​ isolate with cotton rolls & dry the tooth/teeth that will receive a band(s)\n              ○​ apply a thin layer of FujiCem to the inside of the band(s)\n              ○​ cement the space maintainer in place; use band seaters to fully seat the band(s)\n              ○​ clean excess cement with microbrushes\n              ○​ burnish the band to better adapt to the tooth\n    7.​ give post-op instructions\n              ○​ soft diet for today\n\n            ○​ re-emphasize oral hygiene\n            ○​ pt’s gums or teeth may be sore for the next 24 hours\n            ○​ do not play with space maintainer with tongue (will cause soreness)\n            ○​ temporary speech changes will go away\n            ○​ excess saliva will be temporary\n            ○​ if space maintainer comes loose, keep it, and call right away\n    8.​ schedule 2-4 wk post-op appointment"
},
{
"id": "c076.6",
"section": "PEDS",
"title": "SPACE MAINTAINER — space maintainer delivery: note template",
"body": "space maintainer delivery: note template\n - y/o female presents to UG Peds with mother for #30-#S band & loop cementation\n - RMH with mother. No changes.\n - allergies???, no medications, IUTD\n\n #30-#S band & loop cementation\n Band & loop #30-#S tried in. Occlusion evaluated with articulating & is satisfactory; band & loop does not interfere with occlusion. #30 & #S\n cleaned with prophy cup & pumice. Band & loop cemented with FujiCem.\n\n Post-op instructions reviewed with mother — soft diet today, soreness for 24hr, excess saliva, temporary speech disturbance, OHI, loss of\n appliance. Pt released in good condition.\n\n - behavior: F4 --\n - NV:\n - Sarah Swade / Dr."
},
{
"id": "c077.0",
"section": "ORAL SURGERY",
"title": "EXTRACTION — 1.​  set up unit",
"body": "1.​  set up unit\n  2.​  seat patient\n  3.​  take blood pressure & blood sugar\n  4.​  present pt to instructor\n  5.​  have pt sign consent\n            ○​ plug in the signature pad first (!)\n            ○​ click the consent form button → “Add Patient Consent…”\n            ○​ click the “...” → select “Oral Surgery Consent”\n            ○​ under “Name of Doctor,” type the name of the oral surgeon who will be\n                overseeing your procedure (“Dr. Flick”)\n            ○​ under “Operation Description,” type the procedure\n                you’ll be doing (“Ext #12, #13”)\n            ○​ select “Yes” for all of the side effects\n            ○​ under “Other Problems” and “Hours Abstain,” type “0”\n            ○​ exit out of the consent form that pops up\n            ○​ explain the consent form to the patient\n                     ■​ “After an extraction we expect you to have some pain and swelling in the area. At the end we’ll go over\n                          what pain medications you can take to help with that. We also expect some bleeding, but we’ll send you\n                          home with some gauze to keep the area clean. Afterwards, your jaw or the corners of your mouth might\n                          be sore. It’s important you follow the instructions we give you at the end to prevent these potential risks,\n                          like dry socket (where you lose the blood clot from the site) or infection. Sometimes if a small piece of the\n                          root breaks off, there’s a chance we could decide to leave it in the jaw because taking it out would be too\n                          traumatic.”\n            ○​ type the oral surgeon’s name & have the oral surgeon sign the consent form\n            ○​ have the patient sign the consent form\n  6.​ give local anesthetic\n            ○​ you need profound anesthesia\n            ○​ for maxillary extractions: buccal infiltration + greater palatine + PDL\n            ○​ for mandibular extractions: IAN + mental + lingual + buccal + PDL\n  7.​ !!!!! TIME OUT !!!!!\n            ○​ ask the oral surgeon come to the unit for a time out — oral surgeon will ask pt to point to teeth you will extract\n            ○​ when extracting multiple teeth, start with maxillary posterior → work\n                anteriorly → mandibular posterior → work anteriorly\n  8.​ elevate gingiva\n            ○​ retract the patient’s cheek with the Minnesota retractor\n            ○​ ensure the pt is numb by poking with the periosteal elevator\n            ○​ use periosteal elevator (thin sharp side) to loosen the soft tissue around the\n                entire tooth\n                     ■​ insert tip into gingival sulcus → push apically → move elevator\n                          laterally to reflect gingiva away from tooth\n                     ■​ reflect papilla too\n            ○​ patient will feel pressure, but should not feel sharp poking\n  9.​ elevate tooth\n            ○​ insert straight elevator perpendicular to tooth at mesiobuccal or distobuccal line\n                angle, with flat/concave surface toward the tooth to be extracted and convex\n                surface away from the tooth (toward adjacent tooth)\n            ○​ slightly redirect elevator to direct tip apically\n            ○​ rotate apical out / occlusal in (as in diagram)\n            ○​ rotate the elevator back & forth while simultaneously applying apical pressure to\n                advance the elevator into the PDL & expand the socket\n  10.​ extract (deliver) tooth with forceps\n            ○​ chose the proper forceps (below)\n            ○​ hold the forceps with an underhand grip (palm up)\n            ○​ seat the forceps so that the tips of the forceps beaks grasp the root underneath loosened soft tissue\n                     ■​ confirm that the tips of the forceps are beneath the soft tissue\n            ○​ seat the forceps as apically as you possibly can\n                     ■​ if you think you’re apical enough, go even more apically\n\n                   ■​ common mistake: not placing forceps apically enough\n          ○​ luxate\n                   ■​ push buccally until resistance is met (push really hard buccally); hold here 5 seconds\n                            ●​ use slow, steady, & sustained force (no quick wiggling)\n                   ■​ push back lingually until resistance is met (don’t push as hard lingually); hold here 5 seconds\n                   ■​ reseat the forceps more apically as the socket expands\n                   ■​ push again buccally — repeat with slow, sustained, heavy pressure\n                   ■​ for anterior teeth, rotate the tooth\n                   ■​ common mistake: inadequate pressure for insufficient amount of time\n          ○​ summary: seat apically → push buccal → hold 5s → push lingual → hold 5s → seat more apically → repeat\n11.​ irrigate\n          ○​ irrigate with saline in a plastic syringe\n12.​ curette\n          ○​ if the extracted tooth has granulomatous tissue or if the tooth had a periapical radiolucency, gently curette the\n              base/walls of the socket\n          ○​ if no granulomatous tissue or periapical radiolucency, do not curette\n13.​ compress socket\n          ○​ use thumb & index finger to gently compress the buccal & lingual walls of the socket back together\n14.​ remove sharp bone\n          ○​ feel the socket with your finger to see if there are any sharp areas\n          ○​ file sharp bone with the bone file in a pulling motion\n          ○​ use rongeurs to cut larger pieces of sharp bone\n15.​ suture\n          ○​ hold the needle ⅔ down with the needle holders\n          ○​ suture from buccal to lingual\n          ○​ tie a surgeon’s knot (over, under, over)\n          ○​ figure-8 knot: distobuccal → distolingual → mesiobuccal → mesiolingual → surgeon’s\n              knot\n16.​ have pt bite on gauze\n17.​ take post-op blood pressure\n18.​ give post-op instructions\n          ○​ verbally go over the post-op instructions with the pt\n          ○​ give the pt written post-op instructions\n          ○​ give the pt gauze to bring home\n19.​ write note\n          ○​ attach a note using the template found in Axium\n                   ■​ add a note to the code like normal (right click code → click “Add Tx Note…”)\n\n                  ■​ click the ellipses “...” next to Code\n                  ■​ expand UGOS → double click UGOS Extraction\n                  ■​ fill out note"
},
{
"id": "c078",
"section": "ORAL SURGERY",
"title": "INSTRUMENTS",
"body": "periosteal elevator (#9 Molt)\nuse pointed end in a twisting prying motion to elevate soft tissue, especially the papilla\nuse broad end in a sliding stroke to reflect soft tissue\n\nMinnesota retractor\nused to retract the cheek or mucoperiosteal flap\n\nbone file\nuse in a pull stroke to smooth bone or remove small amounts of bone\n\ncurette\nused to remove granuloma, granulation tissue, or cysts from a tooth socket\n\nroot-tip pick\nused to tease small root tips from the socket; insert pick into PDL space between root tip & bone\n\nstraight elevator\nused to elevate the tooth; the concave side is placed in contact with the tooth to be extracted\n\nPotts elevator\nused to elevate the tooth; better angulation for posterior teeth\n\nCryer elevators\n2 types — left & right; used to remove a broken root adjacent to an empty socket (molars); place tip of elevator into empty socket &\nengage the sharp point into interseptal bone, then use rotational force to lift the interseptal bone + root\n\nrongeurs\nused to remove bone; smaller tipped rongeurs can be used to extract root tips\n\nneedle & sutures\nwe use a ⅜ round cutting needle & resorbable chromic gut sutures (size 3-0); hold the needle with the needle holders at ⅔ the\ndistance of the needle\n\nneedle holders\nused to manipulate the needle during suturing; place thumb & middle finger in rings, stabilize with index finger; not a hemostat\n\n(Adson) tissue forceps\nused to hold small pieces of soft tissue, usually during suturing\n\nscissors\nused to cut sutures (or sometimes tissue)\n\n no.    name                   teeth                          image"
},
{
"id": "c079",
"section": "ORAL SURGERY",
"title": "MAXILLARY FORCEPS",
"body": "150    maxillary universal    incisors, canines, premolars\n\n 150A   —                      premolars\n\n  89    maxillary anatomical   UR molars — #1, #2, #3\n\n  90    maxillary anatomical   UL molars — #14, #15, #16"
},
{
"id": "c080",
"section": "ORAL SURGERY",
"title": "MANDIBULAR FORCEPS",
"body": "151    mandibular universal    incisors, canines, premolars\n\n 151A   —                       premolars\n\n  —     English Ash             incisors\n\n  17    mandibular anatomical   molars\n\n87   cowhorn   molars\n\n                        REFERENCES"
},
{
"id": "c081",
"section": "ORAL SURGERY",
"title": "BLOOD PRESSURE",
"body": "S             D\n\n normal\n\n elevated\n\n                         130             80\n\n stage I hypertension\n\n                         140             90\n\n stage II hypertension\n\n                         180            120\n\n hypertensive crisis\n\nUIC protocol for BP\n    ●​ if systolic pressure is greater than 160 or the diastolic pressure is greater than 100, then routine dental care is\n        contraindicated and only urgent care can be provided\n    ●​ if systolic pressure is greater than 180 or the diastolic pressure is greater than 110, no dental care can be provided (even\n        emergency dental care) & pt should be referred to emergency room\n\nUIC protocol for blood glucose\n    ●​ routine dental care is contraindicated in pts whose blood glucose is 200 or above\n    ●​ patients whose blood glucose is less than 70 should be encouraged to eat if they have brought food with them, or should be\n        given food, or be given the glucose gel in the emergency cart (which tastes awful so try to find something else if possible &\n        not an emergency)"
},
{
"id": "c082.0",
"section": "ORAL SURGERY",
"title": "COMMON MEDICATIONS",
"body": "medication              type of drug              use                       mechanism of action\n\nalprazolam                                                                  binds benzodiazepine receptor on GABA neurons &\n                        benzodiazepine            anxiety; panic disorder\nXanax                                                                       inhibits neuron firing in the brain\n\n                                                                            blocks calcium channels in heart muscle to produce\n                                                                            coronary vasodilation; blocks calcium channels in\namlodipine              calcium channel blocker   hypertension; angina\n                                                                            vascular smooth muscle to produce peripheral\n                                                                            vasodilation to lower blood pressure\n\n                                                                            inhibits bacterial cell wall synthesis by binding\namoxicillin             penicillin antibiotic     infection                 penicillin-binding proteins (PBPs), which inhibits\n                                                                            peptidoglycan synthesis\n\natorvastatin            HMG-CoA reductase         hyperlipidemia (high      inhibits HMG-CoA reductase, the rate-limiting\nLipitor                 inhibitor                 cholesterol)              enzyme in cholesterol synthesis\n\n                                                                            inhibits bacterial 50S ribosome to inhibit bacterial\nazithromycin            macrolide antibiotic      infection\n                                                                            protein synthesis\n\nfurosemide              loop diuretic             hypertension; edema       inhibits NaCl reabsorption in the kidney\n\ngabapentin                                                                  binds calcium channels in the brain & inhibits\n                        anticonvulsant            seizures; neuralgia\nGralise, Neurontin                                                          neurotransmitter release to reduce brain activity\n\nhydrochlorothiazide     thiazide diuretic         hypertension; edema       inhibits Na reabsorption in the kidney\n\n                                                                            binds opioid receptors in the CNS, which inhibits\nhydrocodone             opioid analgesic          pain management           ascending pain pathways & altering the perception of\n                                                                            and response to pain\n\nibuprofen                                         pain management;          inhibits COX-1 & COX-2 enzymes, which decreases\n                        NSAID\nAdvil, Motrin                                     fever                     prostaglandin production\n\n                                                                            levothyroxine is a synthetic form of the thyroid\nlevothyroxine           thyroid product           hypothyroidism            hormone thyroxine (T4), which is converted in the\nSynthroid\n                                                                            body to its active metabolite, L-triiodothyronine (T3)\n\n                                                                            inhibits angiotensin-converting enzyme (ACE), which\n                                                  hypertension; heart\nlisinopril              ACE inhibitor                                       prevents conversion of angiotensin I to angiotensin II,\n                                                  failure\n                                                                            a potent vasoconstrictor, & reduces aldosterone\n\n                                                                            binds & blocks angiotensin II receptor, which blocks\n                        angiotensin II receptor   hypertension; diabetic\nlosartan                                                                    the vasoconstrictive & aldosterone-secreting effects\n                        blocker (ARB)             neuropathy\n                                                                            of angiotensin II\n\nmetformin                                                                   decreases hepatic glucose production, decreases\n                        biguanide antidiabetic\nFortamet, Glucophage,                             type 2 diabetes           intestinal absorption of glucose, improves insulin\nGlumetza, Riomet\n                        agent\n                                                                            sensitivity (improves glucose uptake)\n\nmetoprolol                                        hypertension; angina;     selectively inhibits β1 receptors (nor/epinephrine\n                        β blocker\nLopressor                                         heart failure             receptors)\n\nomeprazole                                        heartburn; GERD;          inhibits gastric acid secretion by inhibiting proton\n                        proton pump inhibitor\nPrilosec                                          stomach ulcer             pumps in stomach parietal cells\n\nondansetron             antiemetic                nausea & vomiting         blocks the serotonin receptor 5-HT3 which prevents\n\nZofran                                                       nausea & vomiting\n\n                                                             reduces inflammation & suppresses the immune\n                                                             system by inhibiting neutrophil migration, decreasing\nprednisone   corticosteroid        various\n                                                             capillary permeability, reducing activity & volume of\n                                                             lymphatic system\n\nsertraline                         depression; OCD; panic\n             SSRI antidepressant                             inhibits serotonin (5-HT) reuptake\nZoloft                             disorder; PTSD; anxiety\n\nzolpidem     sedative              insomnia                  enhances GABA inhibitory activity in the brain\nAmbien"
},
{
"id": "c083",
"section": "ORAL SURGERY",
"title": "MATERIALS",
"body": "Link to Sterilization Kits\n\nLink to Materials List\n\nsummary\n                                 JetSet — temporary crown or bridge\n temporary restoration           Integrity — temporary crown (no bridge)\n                                 Telio — temporary inlay/onlay in digital clinic\n\n temporary bridge                JetSet\n\n temporary direct restoration    IRM (zinc oxide eugenol)\n\n                                 TempBond NE\n temporary cement                UltraTemp\n                                 Durelon\n\n                                 FujiCem — RMGI\n permanent cement                RelyX Ultimate — resin; for ceramic restorations\n                                 Panavia — resin; dual-cure; for digitally-designed ceramic crowns\n\n                                 Renamel Microfill — for anterior restorations\n                                 Renamel Nanofill — for anterior or posterior restorations\n direct restoration\n                                 Ketac Nano — RMGI; for non-stress-bearing areas\n                                 Wave — flowable composite; indicated only for small defects & intermediate layer\n\n                                 Gluma — dentin desensitizer for cavity or crown prep\n pulp protectors                 Vitrebond — RMGI; liner that releases fluoride; not for pulp capping (direct or indirect)\n                                 Dycal (calcium hydroxide) — pulp cap (direct or indirect)\n\n core buildup                    Bisco Light-Core — comes in blue or natural color\n\n prefabricated post              ParaPost\n\n                                 Viscostat — ferric sulfate 20%\n hemorrhage control              Viscostat clear — aluminum chloride 25%\n                                 Hemodent — buffered aluminum chloride\n\n denture fit evaluation          pressure indicating paste (PIP)\n\n crown (bridge) fit evaluation   fit-checker\n\n denture retention               Fixodent\n\n                                 Coe Comfort — tissue conditioner reline material\n denture reline                  Coe Soft — soft reline material\n                                 GC Reline — hard reline material"
},
{
"id": "c084.0",
"section": "ORAL SURGERY",
"title": "ENDODONTIC DIAGNOSIS — pulpal diagnosis",
"body": "pulpal diagnosis\ndiagnosis                              pain                                   pulp testing                          common causes\nnormal pulp                                                                   - normal cold\n                                       - no pain                                                                    —\n(vital, normal)                                                               - vital EPT\n                                                                              - sharp, quick, hypersensitive pain   - dentin hypersensitiviy\nreversible pulpitis                    - provoked pain\n                                                                              that subsides (no linger)             - caries\n(vital, inflamed)                      - no spontaneous pain\n                                                                              - vital EPT                           - deep restorations\n                                       - provoked pain                        - sharp severe pain on cold/hot       - deep caries\n                        symptomatic    - spontaneous pain possible            that lingers                          - extensive restorations\nirreversible pulpitis                  - referred pain possible               - vital EPT                           - fractures exposing pulp\n(vital, inflamed)                    - no pain                                                                      - trauma\n                                                                              - normal cold\n                        asymptomatic (diagnosed with trauma or deep                                                 - deep caries that will expose pulp\n                                                                              - vital EPT\n                                     caries that would expose pulp)                                                 upon excavation\n                                                                                                                    - deep caries\n                                                                              - unresponsive cold/hot\npulpal necrosis (nonvital)             - none                                                                       - extensive restorations\n                                                                              - nonvital EPT (80)\n                                                                                                                    - fractures exposing pulp\n\nsummary\n   ●​ cold test pain that subsides → reversible pulpitis\n   ●​ cold test pain that lingers → irreversible pulpitis\n   ●​ cold test no response → necrotic\n\napical (periapical, periradicular) diagnosis\ndiagnosis                             symptoms                                     radiographic findings\nnormal apical tissues                 - not tender to percussion                   - none\n                                      - tender to percussion\n                        symptomatic   - may be tender to palpation                 may have apical radiolucency or widened PDL space\n                                      - may be mobile\napical periodontitis\n                                     - not tender to percussion\n                        asymptomatic - not tender to palpation                     - apical radiolucency\n                                     - may be mobile\n                                      - tender to percussion\n                                      - tender to palpation\n                                      - pus formation\n                        acute         - rapid onset                                may have apical radiolucency or widened PDL space\n                                      - spontaneous pain\n                                      - swelling\napical abscess                        - may be mobile\n                                      - may be tender to percussion\n                                      - may be tender to palpation\n                                      - pus discharge through a sinus tract\n                        chronic                                                    - apical radiolucency\n                                      - gradual onset\n                                      - little to no pain\n                                      - may be mobile\ncondensing osteitis                   - usually asymptomatic                       - commonly seen in mandibular molars\n\nsummary\n   ●​ pain on percussion → symptomatic apical periodontitis\n   ●​ apical radiolucency but no symptoms → asymptomatic apical periodontitis\n   ●​ symptoms + pus + swelling + rapid onset → acute apical abscess\n   ●​ sinus tract → chronic apical abscess"
},
{
"id": "c085.0",
"section": "ORAL SURGERY",
"title": "ENDODONTIC TESTING",
"body": "test            what does it detect?               how to record results               results are consistent with              other potential explanations\n\n                                                                                       - normal: 2s / 2s (patient feels cold,\n                                                                                       feeling does not linger)\n                                                                                        - reversible pulpitis: 0.5 s/3 s        - false positive: cotton pellet\n                                                   x s. / x s.\n                a pulp test — differentiates                                           (stronger, painful, quicker              touches adjacent teeth, anxious\n                                                        ↳ duration until response,\ncold test       between normal, inflamed, &                                            response, does not significantly         patients respond preemptively\n                                                        duration of linger\n                necrotic pulp                                                          linger)                                  - false negative: pulp chamber\n                                                   NR if no response\n                                                                                       - symptomatic irreversible pulpitis:     calcification, not enough Endo Ice\n                                                                                       0.5 s / 20s (stronger, painful,\n                                                                                       quicker response that lingers)\n\n                a pulp test — differentiates\n                                                                                                                                - false negative: pulp chamber\nEPT             between normal, inflamed, &        #                                   - 80 = necrotic pulp\n                                                                                                                                calcification, pulpal recession\n                necrotic pulp\n\n                                                   – = not tender                                                               - high restoration, parafunctional\n                                                   + = mildly tender                                                            habits, blunt trauma, advanced\npercussion      inflammation of the PDL                                                - symptomatic apical periodontitis\n                                                   ++ = moderately tender                                                       periodontal disease, sinusitis,\n                                                   +++ = severely tender                                                        orthodontics\n\n                                                   – = not tender\n                inflammation of the PDL            + = mildly tender                   - cracked tooth/root with vital pulp\nbite test                                                                                                                                        —\n                replicates CC of “chewing pain”    ++ = moderately tender              - faulty restoration\n                                                   +++ = severely tender\n\n                                                   – = not tender\n                                                                                       - necrotic pulp                          - gingival conditions (herpes,\n                                                   + = mildly tender\n                                                                                       - apical periodontitis                   aphthous ulcers), trauma\npalpation       inflammation of the periosteum     ++ = moderately tender\n                                                                                       - apical abscess: fluctuant area or      - in posterior maxilla, sinus\n                                                   +++ = severely tender\n                                                                                       pus                                      inflammation\n                                                   also indicate location\n\n                                                   0 = no mobility\n                                                                                                                                - periodontal disease, trauma,\n                                                   1 = less than 1 mm BL\nmobility        loss of supporting alveolar bone                                       - necrotic pulp                          parafunctional habits, crown\n                                                   2 = 1+ mm BL\n                                                                                                                                fracture\n                                                   3 = 1+ mm BL and vertical\n\n                                                                                       - a narrow, deep probing depth\n                                                                                       (esp. on proximal surface of\n                                                                                       posterior tooth) is consistent with\nprobing depth   tooth fractures                    in mm                               crown/root fracture                      - periodontal disease\n                                                                                       - narrow, deep probing depth may\n                                                                                       be a sinus tract → apical abscess,\n                                                                                       necrotic pulp\n\n                a pulp test — differentiates       x s. / x s.                          - rarely performed; only performed\nhot test        between normal, inflamed, &        duration until response, duration of when patient’s chief complaint is                        —\n                necrotic pulp                      linger                               heat\n\n                a pulp test — differentiates\n                                                   NR — no response                    - rarely performed\ntest cavity     between normal, inflamed, &                                                                                                      —\n                                                   pain upon test cavity               - no response → necrotic pulp\n                necrotic pulp"
},
{
"id": "c086",
"section": "ORAL SURGERY",
"title": "LOCAL ANESTHETIC",
"body": "source: Dental Nerve Blocks (ClinicalKey Procedures Consult); Oral Nerve Block (Medscape); Handbook of Local Anesthesia, Chapter 13\ngeneral considerations\n    ●​ do not insert the needle to its full length at the hub; should inadvertent breakage occur, needle retrieval would be difficult\n    ●​ do not change direction of a needle while it is deep in the tissue\n    ●​ always aspirate before injection to avoid accidental intravascular injection\n    ●​ inject anesthetic slowly to minimize pain\n    ●​ do not inject into or through an infected area\n    ●​ needles no smaller than 27 gauge should be used; higher gauge makes aspiration difficult"
},
{
"id": "c087.0",
"section": "ORAL SURGERY",
"title": "MAXILLARY ANESTHESIA — (1) buccal infiltration",
"body": "(1) buccal infiltration\n     ●​ anesthetizes: individual maxillary teeth + associated buccal gingiva (+ sometimes palatal gingiva depending on amount)\n     ●​ the goal is to deposit the anesthetic near the bone that supports the tooth; the anesthetic must penetrate the cortex of\n         bone to reach the nerve of the individual tooth\n     ●​ the injection may fail if the solution is deposited too far from the periosteum, if the needle is passed too far above or below\n         the roots of the teeth, or if the bone in the area is unusually dense\n     ●​ infiltration of the area around the maxillary canine & first premolar will anesthetize the MSA + ASA nerves\n     ●​ technique:\n              ○​ apply topical anesthetic\n                        ■​ most patients fear dental blocks; their anxiety & pain may be lessened considerably with topical anesthetic\n                        ■​ thoroughly dry the area with gauze\n                        ■​ coat a cotton-tipped applicator with 20% benzocaine\n                        ■​ paint the area of the injection; the patient may hold the cotton swab in place with their hand or the cheek\n                            may be used to hold it in place\n                        ■​ adequate anesthesia is achieved in 2-3 minutes\n              ○​ pull the mucous membrane outward & downward to extend the mucosa & delineate the mucobuccal fold\n              ○​ puncture the mucobuccal fold with the bevel of the needle facing the bone, aligned with the center of the tooth to\n                    be anesthetized, aimed toward the maxilla\n              ○​ contact the maxilla then withdraw the needle 1 mm\n              ○​ aspirate\n              ○​ deposit anesthetic\n\n(2) palatal infiltration\n     ●​ anesthetizes: palatal gingiva immediately surrounding a single tooth\n     ●​ technique:\n               ○​ apply topical anesthetic\n               ○​ apply pressure to the injection site with a cotton-tipped applicator to blanch it (with your left hand)\n               ○​ puncture the palatal gingiva within the blanched area close to the cotton-tipped applicator\n               ○​ deposit a small volume of local anesthetic while simultaneously advancing the needle until bone is contacted\n\n(3) PSA block\n     ●​ anesthetizes: maxillary molars + associated buccal gingiva\n              ○​ the MB root of maxillary 1st molar is usually innervated by the MSA (not PSA) and may require additional injection\n     ●​ technique:\n              ○​ apply topical anesthetic\n              ○​ retract the cheek laterally\n              ○​ puncture the mucobuccal fold just distal to the distobuccal root of the maxillary second molar\n              ○​ direct the needle toward the maxillary tuberosity (upward, backward, inward) then along the curvature of the\n                 maxilla to a depth of 2.0 to 2.5 cm\n                      ■​ avoid advancing the needle too far posteriorly, as this can result in a division II block of CN V\n                      ■​ if the needle contacts bone, withdraw it & redirect more laterally\n              ○​ aspirate (especially important to avoid injection into pterygoid plexus, which causes hematoma formation)\n              ○​ deposit anesthetic\n\n(4) MSA block\n     ●​ anesthetizes: maxillary premolars + mesiobuccal root of maxillary first molar + associated buccal gingiva\n     ●​ technique:\n            ○​ apply topical anesthetic\n            ○​ retract the cheek laterally\n            ○​ puncture the mucobuccal fold between the maxillary second premolar & maxillary first molar\n            ○​ direct the needle posteriorly at a 45° angle & into the tissue at 45°\n            ○​ advance the needle to a depth of 1 to 1.5 cm\n            ○​ aspirate\n            ○​ deposit anesthetic\n\n(5) ASA block\n     ●​ anesthetizes: maxillary incisors + maxillary canine + associated buccal gingiva\n     ●​ the landmark for this technique is the apex of the canine tooth\n     ●​ technique:\n             ○​ apply topical anesthetic\n             ○​ retract the lip anteriorly & locate the mucobuccal fold\n             ○​ puncture the mucobuccal fold at the apex of the canine tooth\n             ○​ insert the needle into the intersection of the mucobuccal fold & the apex/center of the canine at a 45° angle\n             ○​ advance the needle to a depth of 1 to 1.5 cm\n             ○​ aspirate\n             ○​ deposit anesthetic\n\n(6) greater palatine block\n     ●​ anesthetizes: posterior ⅔ of palatal gingiva (from premolars distally, unilaterally)\n     ●​ technique:\n              ○​ locate the greater palatine foramen via palpation: the greater palatine foramen is located 1 cm medially from the\n                   distal of the 2nd molar; a cotton-tipped applicator will fall into place\n              ○​ apply topical anesthetic\n              ○​ apply sufficient pressure with the cotton-tipped applicator to cause tissue blanching for 30 seconds\n              ○​ puncture the palatal gingiva within the blanched area close to the cotton-tipped applicator at a 90° angle to the\n                   curvature of the hard palate; do not advance the needle\n              ○​ aspirate\n              ○​ deposit ¼ carpule of anesthetic — do not inject more, as it can separate the mucosa from the palate (risks necrosis)\n\n(7) nasopalatine block\n     ●​ anesthetizes: anterior ⅓ of palatal gingiva (canine to canine bilaterally)\n     ●​ technique:\n             ○​ locate the incisive foramen via palpation: the incisive foramen is located underneath the incisive papilla, which is\n                 usually located 0.5 cm posterior to the central incisors at the midline\n             ○​ apply topical anesthetic\n             ○​ apply sufficient pressure with the cotton-tipped applicator to cause tissue blanching for 30 seconds\n             ○​ puncture the palatal mucosa just lateral to the incisive papilla\n             ○​ advance the needle 3-4 mm medially or until the needle contacts bone\n             ○​ aspirate\n             ○​ deposit ¼ carpule of anesthetic — do not inject more, as it can separate the mucosa from the palate (risks necrosis)\n\n(8) infraorbital block\n     ●​ anesthetizes: incisors + premolars + buccal gingiva + lower eyelid + upper cheek + part of nose + upper lip\n     ●​ technique:\n              ○​ locate the infraorbital foramen via palpation: the infraorbital foramen is just medial to the intersection of a vertical\n                   line from the pupil to the inferior border of the infraorbital ridge\n              ○​ apply topical anesthetic\n              ○​ place the index finger of the left hand above the infraorbital foramen & retract the cheek with the thumb\n              ○​ puncture the mucobuccal fold at the junction of the premolars; direct the needle parallel to the long axis of the\n                   second premolar, palpating its location as the needle is advanced\n              ○​ advance the needle until it is adjacent to the infraorbital foramen, about 1.5 - 2 cm\n                        ■​ if the needle is advanced at an angle that is too acute, it will hit the maxillary eminence\n                        ■​ if the needle is advanced at an angle that is to superior, the needle will enter the orbit\n              ○​ aspirate\n              ○​ deposit anesthetic while holding firm pressure over the infraorbital ridge to prevent ballooning the lower eyelid"
},
{
"id": "c088.0",
"section": "ORAL SURGERY",
"title": "MANDIBULAR ANESTHESIA — (1) IAN block + lingual block",
"body": "(1) IAN block + lingual block\n     ●​ anesthetizes: all mandibular teeth + buccal gingiva from premolars to midline + lingual gingiva + floor of mouth + tongue +\n         lower lip + skin of chin\n     ●​ technique:\n             ○​ palpate the retromolar fossa with the index finger or thumb\n             ○​ identify the coronoid notch (the greatest depth of anterior border of the ramus of the mandible)\n             ○​ with the thumb in the mouth & the index finger placed externally behind the ramus, retract the tissues toward the\n                   buccal side & visualize the pterygomandibular triangle\n             ○​ hold the syringe parallel to the occlusal surfaces of the teeth & angled so that the barrel of the syringe lies between\n                   the premolars on the opposite side of the mandible\n             ○​ puncture the the pterygomandibular triangle at a point 1 cm above the occlusal surface of the molars\n                        ■​ if the needle enters too low (ex: at the level of the teeth), the anesthetic will be deposited over the bony\n                            canal & prominence (lingula) that house the mandibular nerve & not over the nerve itself\n             ○​ there may be slight resistance as the needle passes through the ligaments & muscles covering the internal surface\n                   of the mandible\n             ○​ stop when the needle has reached bone, which signifies contact with the posterior wall of the mandibular sulcus\n                        ■​ it is important to contact bone with the needle; failure to feel bone generally results from directing the\n                            needle toward the parotid gland (too far posteriorly), and injecting into the parotid gland can anesthetize\n                            the facial nerve\n             ○​ after reaching bone, withdraw the needle slightly\n             ○​ aspirate\n             ○​ deposit anesthetic\n             ○​ deposit anesthetic while withdrawing the needle to ensure anesthesia of the lingual nerve\n\nIAN block​        ​         lingual block​   ​        IAN + lingual blocks\n\n(2) long buccal block\n     ●​ anesthetizes: buccal gingiva of molars\n     ●​ technique:\n             ○​ apply topical anesthetic\n             ○​ pull the cheek laterally\n             ○​ puncture the mucosa 1 mm lateral to the molars at the anterior border of the ramus in the occlusal plane\n             ○​ advance the needle 3-4 mm\n             ○​ aspirate\n             ○​ deposit anesthetic\n\n(3) mental nerve block\n     ●​ anesthetizes: premolars + canine + (sometimes incisors) + buccal gingiva from premolars to midline + lower lip + skin of chin\n     ●​ technique:\n             ○​ locate the mental foramen via palpation: the mental foramen is located halfway between the upper & lower edge\n                 of the mandible underneath the 2nd premolar\n                      ■​ alternatively, locate the mental foramen on the pt’s panoramic radiograph\n             ○​ apply topical anesthetic\n             ○​ retract the lower lip\n             ○​ puncture the mucosa at depth of the buccal vestibule at the location of the 2nd premolar & parallel to its long axis\n             ○​ insert the needle to ~1 cm\n             ○​ aspirate\n             ○​ deposit anesthetic\n\noral cavity innervation — source: Pain Control [3] Trigeminal Nerve (Miloro)\narch           structure          innervation                                              injection technique\n               incisors                                                                    - buccal infiltration\n                                  - anterior superior alveolar n.\n               + buccal gingiva                                                            - ASA block\n               canine                                                                      - buccal infiltration\n                                  - anterior superior alveolar n.\n               + buccal gingiva                                                            - MSA block\n               premolars                                                                   - buccal infiltration\n                                  - middle superior alveolar n.\n               + buccal gingiva                                                            - MSA block\nmaxillary\nCN V2                           - posterior superior alveolar n.\n               molars                                                                      - buccal infiltration\n                                - mesiobuccal root of first molar: 75% middle\n               + buccal gingiva                                                            - PSA block\n                                superior alveolar n.)\n                                                                                           - palatal infiltration\n                                  - anterior (canine to canine): nasopalatine n.\n               palatal gingiva                                                             - nasopalatine block\n                                  - posterior: greater palatine n.\n                                                                                           - greater palatine block\n               upper lip          - infraorbital n.                                        - infraorbital block\n                                  - dental incisive branches of inferior alveolar n.       - IAN block\n               incisors\n                                  - some from mylohyoid n.                                 - mental block\n                                                                                           - IAN block\n               canine             - dental incisive branches of inferior alveolar n.\n                                                                                           - mental block\n                                                                                           - IAN block\n               premolars          - inferior alveolar n.\n                                                                                           - mental block\n                                  - inferior alveolar n.\nmandibular molars                 - some from mylohyoid n., esp. mesial root of first molar - IAN block\nCN V3                             - buccal gingiva: long buccal n.\n                                  - from incisors to premolars: mental n.                  - mental block\n               buccal gingiva\n                                  - of molars: long buccal n.                              - buccal block\n               lingual gingiva - lingual n.                                                - lingual block (usually on withdrawal of IAN block)\n               floor of mouth - lingual n.                                                 - lingual block (usually on withdrawal of IAN block)\n               tongue (a. ⅔)      - lingual n.                                             - lingual block (usually on withdrawal of IAN block)\n               lower lip          - mental n.                                              - mental block\n\n                                                                maximum dose\n\n   local anesthetic                                             anesthetic                                          vasoconstrictor\n                       vasoconstrictor   max dose    max dose                in 1 carpule     max      max dose               in 1 carpule     max\n    type          %                                               in 1 mL                                         in 1 mL\n                                         by weight    total                    (1.8 mL)     carpules    total                   (1.8 mL)     carpules\n                             none                                                             13                     —                —        —\n  lidocaine      2%      1:100,000 epi   7 mg/kg     500 mg       20 mg        36 mg          13 .      0.2 mg    0.01 mg      0.018 mg        11\n                         1:50,000 epi                                                         13 .                0.02 mg      0.036 mg         5\n                 3%          none                                 30 mg        54 mg           7          —          —                —        —\n mepivacaine                             6.6 mg/kg   400 mg\n                 2%      1:200,000 lev                            20 mg        36 mg          11        0.1 mg    0.005 mg     0.009 mg        11\n                             none                                                                         —          —                —        —\n  prilocaine     4%                      8 mg/kg     600 mg       40 mg        72 mg           8\n                         1:200,000 epi                                                                  0.2 mg    0.005 mg     0.009 mg        22 .\n                         1:200,000 epi                                                                  0.2 mg    0.005 mg     0.009 mg        22 .\n  articaine      4%                      7 mg/kg     500 mg       40 mg        72 mg           6\n                         1:100,000 epi                                                                  0.2 mg    0.01 mg      0.018 mg        11 .\n bupivacaine    0.5%     1:200,000 epi   1.3 mg/kg    90 mg        5 mg         9 mg          10        0.2 mg    0.005 mg     0.009 mg        22 .\n\nanesthetic summary\n    ●​ 1 carpule of 2% has 36 mg\n    ●​ 1 carpule of 3% has 54 mg\n    ●​ 1 carpule of 4% has 72 mg\n\nvasoconstrictor summary\n    ●​ 1 carpule of 1:200,000 has 0.009 mg\n    ●​ 1 carpule of 1:100,000 has 0.018 mg\n    ●​ 1 carpule of 1:50,000 has 0.036 mg"
},
{
"id": "c090",
"section": "ORAL SURGERY",
"title": "OHI",
"body": "brushing\n    ●​ use a soft-bristled toothbrush\n    ●​ only a pea-size amount of toothpaste\n    ●​ goal: remove plaque at & below gumline\n    ●​ angle bristles at 45° to teeth\n    ●​ move brush back & forth in 10-20 short strokes, over 2-3 teeth at a time\n    ●​ buccal & lingual\n    ●​ for lingual of anteriors, hold brush vertically & use up-down strokes\n    ●​ brush teeth surfaces\n    ●​ brush tongue\n    ●​ brush 2x a day for 2 minutes each\n    ●​ replace toothbrush every season\n\nflossing\n     ●​ arm’s length of floss\n     ●​ wrap around both middle fingers, more on dominant hand\n     ●​ leave 3” between\n     ●​ saw between teeth — do not pop\n     ●​ wrap floss around in C-shape\n     ●​ up & down 5 times\n     ●​ rotate floss — new floss on each tooth\n     ●​ 1x a day\n\nother aids\n    ●​ electric toothbrush\n    ●​ water flosser\n    ●​ floss holder\n    ●​ pre-threaded floss pick\n    ●​ floss threader\n    ●​ rubber soft-pick\n    ●​ interdental brush (proxabrush)\n    ●​ end-tuft brush\n\ndentures / partials\n    ●​ rinse dentures with water after eating — be careful not to drop/break\n    ●​ clean dentures at night:\n             ○​ brush with soft toothbrush (denture brush)\n             ○​ don’t use toothpaste — use specific denture toothpaste, or use soap\n             ○​ make sure all food & glue is brushed off\n    ●​ clean gums at night:\n             ○​ use soft bristled toothbrush & toothpaste\n             ○​ use wet cloth\n    ●​ soak dentures overnight in water (or Polident + water)\n    ●​ only warm or cool water — never hot water\n    ●​ bring dentures/partials with you to your appointment for dentist to clean in ultrasonic"
},
{
"id": "c091.0",
"section": "ORAL SURGERY",
"title": "ANTIBIOTIC PROPHYLAXIS — include in note",
"body": "include in note\n ANTIBIOTIC PROPHYLAXIS\n Patient reported taking 2g amoxicillin 1 hour before appointment for antibiotic prophylaxis as prescribed.\n\nconditions requiring antibiotic prophylaxis\n    ●​ cardiac conditions:\n             ○​ prosthetic cardiac valve\n             ○​ previous infective endocarditis\n             ○​ congenital heart disease (CHD)\n                      ■​ unrepaired cyanotic CHD, including palliative shunts & conduits\n                      ■​ completely repaired congenital heart defect with prosthetic material/device during the first 6 months after\n                          the procedure\n                      ■​ repaired CHD with residual defects at the site or adjacent to the site of a prosthetic patch or prosthetic\n                          device (which inhibit endothelialization)\n             ○​ cardiac transplantation recipients who develop cardiac valvulopathy\n    ●​ prosthetic joints:\n             ○​ antibiotic prophylaxis is usually not required for patients with prosthetic joints\n             ○​ “The new CSA guideline clearly states that for most patients, prophylactic antibiotics are not indicated before\n                 dental procedures to prevent [prosthetic joint infections]. The new guideline also takes into consideration that\n                 patients who have previous medical conditions or complications associated with their joint replacement surgery\n                 may have specific needs calling for premedication. In medically compromised patients who are undergoing dental\n                 procedures that include gingival manipulation or mucosal inclusion, prophylactic antibiotics should be considered\n                 only after consultation with the patient and orthopedic surgeon. For patients with serious health conditions, such\n                 as immunocompromising diseases, it may be appropriate for the orthopedic surgeon to recommend an antibiotic\n                 regimen when medically indicated, as footnoted in the new chairside guide.”\n             ○​ “In cases where antibiotics are deemed necessary, it is most appropriate that the orthopedic surgeon recommend\n                 the appropriate antibiotic regimen and, when reasonable, write the prescription.”\n\ndental procedures requiring antibiotic prophylaxis\n    ●​ all procedures that involve manipulation of gingival tissue, the manipulation of the periapical region of teeth, or perforation\n         of the oral mucosa — including the following:\n              ○​ perio probing\n              ○​ prophy\n              ○​ perio maintenance\n              ○​ rubber dam clamp\n              ○​ matrix band placement (class II, III, IV restorations)\n              ○​ gingival retraction cord placement\n    ●​ the following procedures and events do not need prophylaxis:\n              ○​ routine anesthetic injections through non-infected tissue\n              ○​ taking dental radiographs\n              ○​ placement of removable prosthodontic or orthodontic appliances\n              ○​ adjustment of orthodontic appliances\n              ○​ placement of orthodontic brackets\n              ○​ shedding of deciduous teeth\n              ○​ bleeding from trauma to the lips or oral mucosa\n              ○​ denture fabrication, delivery, adjustment\n\nprescribing prophylactic antibiotics\n    ●​ generate an appropriate prescription through the Axium eRx Module prior to the next appointment\n    ●​ patient should pick up antibiotics at the pharmacy prior to the next appointment\n\nemergency procedures & antibiotics\n   ●​ if a patient who requires antibiotic prophylaxis & has not had the prescription filled —or— if a patient who requires\n       antibiotic prophylaxis needs an emergency procedure → antibiotics (clindamycin and amoxicillin only) are available on site\n       and can be appropriated for immediate patient use\n   ●​ how to obtain on-site antibiotics:\n\n               ○​ generate an appropriate prescription through Axium & have it signed by supervising instructor\n               ○​ take the completed prescription to the predoctoral OS clinic & give it to the instructor\n               ○​ the OS instructor will dispense the appropriate medication (amoxicillin or clindamycin)\n               ○​ retain the Axium prescription in the appropriate folder\n               ○​ verify the appropriate medication before administering to the patient\n       ●​ if the dosage of antibiotic is inadvertently not administered before the procedure, the dosage may be administered up to 2\n          hours after the procedure\n\nantibiotics\nsituation                          agent                            adults                children\noral                               amoxicillin                      2g                    50 mg/kg\n                                   ampicillin                       2 g IM or IV          50 mg/kg IM or IV\nunable to take oral medication\n                                   cefazolin/ceftriaxone            1 g IM or IV          50 mg/kg IM or IV\n                                   cephalexin                       2g                    50 mg/kg\nallergic to penicillins            clindamycin                      600 mg                20 mg/kg\n                                   azithromycin/clarithromycin      500 mg                15 mg/kg\nallergic to penicillins &          cefazolin/ceftriaxone            1 g IM or IV          50 mg/kg IM or IV\nunable to take oral medication     clindamycin                      600 mg IM or IV       20 mg/kg IM or IV\n\n​"
},
{
"id": "c092",
"section": "ORAL SURGERY",
"title": "MRONJ",
"body": "●​ medication-related osteonecrosis of the jaw (MRONJ) is a rare, but serious adverse effect of antiresorptive agents and\n      antiangiogenic agents\n   ●​ these agents are used by patients being treated for osteoporosis and/or certain cancers\n   ●​ MRONJ is associated with bone-invasive dental procedures such as tooth extraction, but it can also occur spontaneously\n\nguidelines for patients with cancer taking IV bisphosphonates or antiangiogenic drugs\n    ●​ maintaining good oral hygiene and dental care is of paramount importance in preventing dental disease that may require\n         dentoalveolar surgery\n    ●​ procedures that involve direct osseous injury should be avoided\n    ●​ non-restorable teeth may be treated by removal of the crown and endodontic treatment of the remaining roots\n    ●​ implant placement:\n             ○​ placement of dental implants should be avoided in the oncology patient receiving IV antiresorptive therapy or\n                  antiangiogenic medications\n             ○​ there is no data regarding the risk of osteonecrosis associated with implant placement in patients receiving\n                  antiangiogenic medications\n\nguidelines for patients with osteoporosis taking oral bisphosphonates\n    ●​ for patients who have taken an oral bisphosphonates for less than 4 years and have no clinical risk factors → no alteration or\n         delay in surgery is necessary\n              ○​ if dental implants are placed, informed consent should be provided related to possible long-term implant failure\n                   and the low risk of developing osteonecrosis of the jaws if the patient continues to take an antiresorptive agent\n    ●​ for patients who have taken an oral bisphosphonate for less than 4 years and have also taken corticosteroids or\n         antiangiogenic medications concomitantly → the prescribing physician should be contacted to consider discontinuation of\n         the oral bisphosphonate (drug holiday) for at least 2 months prior to oral surgery, if systemic conditions permit\n              ○​ the antiresorptive should not be restarted until osseous healing has completed\n    ●​ for patients who have taken an oral bisphosphonate for more than 4 years (with or without any concomitant medical\n         therapy) → the prescribing physician should be contacted to consider discontinuation of the oral bisphosphonate (drug\n         holiday) for at least 2 months prior to oral surgery, if systemic conditions permit\n              ○​ the antiresorptive should not be restarted until osseous healing has completed\n​"
},
{
"id": "c093",
"section": "ORAL SURGERY",
"title": "PREGNANT PATIENTS",
"body": "guidelines\n    ●​ maintenance of oral hygiene and good dental care is an integral part of prenatal care; this should include oral hygiene\n         instructions, plaque control and periodontal care\n    ●​ extensive elective restorative care should be deferred until pregnancy is completed\n    ●​ the safest time for providing dental care is the second trimester\n    ●​ patient evaluation should include determination of the trimester and health status; confirm that medical prenatal care is\n         ongoing; obtain a note or clearance from the physician with any concerns or management recommendations\n    ●​ emergency dental treatment may be provided at any time during the pregnancy\n              ○​ appropriate medical consultation is particularly important in the 1st and 3rd trimesters\n              ○​ minimize radiographic exposure; however, radiographs that are necessary to make a diagnosis for an urgent dental\n                   problem should be taken\n              ○​ local anesthesia is considered safe\n                       ■​ preference should be given to local anesthetics in Category B: Lidocaine & Prilocaine\n              ○​ minimize drug use\n                       ■​ drug selection should favor drugs in the B/C categories\n                       ■​ the analgesic of choice is acetaminophen, category B\n                                ●​ aspirin and NSAIDS are associated with constriction of the ductus arteriosus and postpartum\n                                    hemorrhage particularly in the 3rd trimester\n                                ●​ prolonged or high dose of opioids are associated with congenital abnormalities and respiratory\n                                    depression\n                                ●​ the risks and benefits to the mother and fetus must be considered before prescribing drugs other\n                                    than acetaminophen; consultation with the patient’s physician is recommended\n                       ■​ the antibiotics of choice include penicillin, cephalosporin, clindamycin, azithromycin, all category B\n                                ●​ tetracycline is contraindicated (Category D)\n                       ■​ few anxiolytics are considered safe during pregnancy"
},
{
"id": "c094",
"section": "ORAL SURGERY",
"title": "COMMON PRESCRIPTIONS",
"body": "Rx: amoxicillin 500 mg\n                                     Disp: 4 tablets\n                                     Sig: take 4 tablets 1 hour prior to dental procedure when directed by dentist\nantibiotic prophylaxis\n                                     Rx: clindamycin 300 mg\n                                     Disp: 2 tablets\n                                     Sig: take 2 tablets 1 hour prior to dental procedure when directed by dentist\n\n                                     Rx: “Magic Mouthwash” — viscous lidocaine 2% 150mL; diphenhydramine 12.5mg/5mL\n                                     20mL; hydrocortisone 100mg; tetracycline 2g; nystatin suspension 20ml\nprimary herpetic gingivostomatitis\n                                     Disp: 1 bottle\n                                     Sig: swish and expectorate 15 to 30 mL every 4 to 6 hours\n\n                                     Rx: debacterol\naphthous ulcers                      Disp: 1 kit\n                                     Sig: one clinical application directly to the ulcer for 15 seconds, then rinse thoroughly\n\n                                     Rx: nystatin oral suspension 100,000 units/mL\n                                     Disp: 60 mL\n                                     Sig: swish 2-5 mL 4 times daily; rinse for 2 minutes and swallow; add 2 mL to water used to\n                                     soak dentures\ncandidiasis\n                                     Rx: Mycelex (clotrimazole) troche 10 mg\n                                     Disp: 50 troches\n                                     Sig: let 1 troche dissolve in mouth 5 times daily\n\n                                     Rx: nystatin + triamcinolone acetonide ointment (Mycolog II)\nangular cheilitis                    Disp: 15g tube\n                                     Sig: apply to affected area after each meal & at bedtime\n\n                                     Rx: pilocarpine 5 mg (Salagen)\nxerostomia                           Disp: 100 tablets\n                                     Sig: take 1 tablet 3x daily\n\n                                     Rx: acetaminophen 300 mg with codeine 30 mg (Tylenol #3)\npost-op pain                         Disp: 16 tablets\n                                     Sig: take 2 tablets every 6 hours for pain"
},
{
"id": "c095",
"section": "POLICIES",
"title": "PHONE NUMBERS",
"body": "●​ UIC College of Dentistry main phone number: (312) 996-7555\n          ○​ through this number, the patient can reach all of the departments below\n  ●​ 2nd floor front desk: (312) 355-3368\n  ●​ Chicago (Vivaldi) front desk: (312) 355-0524\n  ●​ faculty practice: (312) 413-2835\n  ●​ implant: (312) 996-3145\n  ●​ oral medicine: (312) 355-1222\n  ●​ orthodontics: (312) 996-7505\n  ●​ pediatrics: (312) 996-7532\n  ●​ pediatrics urgent care: (312) 413-0972\n  ●​ PG endodontics: (312) 355-3615\n  ●​ PG OMFS: (312) 996-7460\n  ●​ PG periodontics: (312) 996-7374\n  ●​ PG prosthodontics: (312) 996-9223\n  ●​ radiology: (312) 996-6477\n  ●​ urgent care: (312) 996-8636"
},
{
"id": "c096",
"section": "POLICIES",
"title": "AFTER HOURS EMERGENCY",
"body": "if a patient has an emergency after hours & is contacting you:\n      ●​ schedule them as soon as you can see them — this may require re-arranging your schedule\n      ●​ if you cannot schedule them soon enough, have a classmate see them (send an Axium message)\n      ●​ if the patient needs to be seen before the next available appointment:\n                ○​ you call the phone number for the on-call endo resident 312-996-2242, pager ID #4994\n                          ■​ call the endo resident if the patient may need a prescription or something else more minor that the endo\n                               resident can deal with (pain, prescription)\n                          ■​ explain the situation to the endo resident & they’ll tell you how to proceed\n                ○​ you call the on-call OMFS resident at the University of Illinois Hospital at 312-996-7297\n                          ■​ call the OMFS resident if the patient needs urgent care immediately but is not life threatening (avulsed\n                               tooth, fractured tooth)\n                          ■​ there is a substantial charge for services in the hospital emergency department and patients should be\n                               informed that they will be billed by the hospital and by the ER physicians; dentists/residents are unable to\n                               waive the emergency fees from the University of Illinois Hospital\n                ○​ if the patient has life threatening symptoms (trouble breathing, extreme swelling, etc.) → tell them to go to the\n                     nearest emergency room immediately\n      ●​ if a patient has an emergency during break:\n                ○​ patient should call the 2nd floor front desk at (312) 355-3368 in order to be seen\n      ●​ if it is a pediatric patient:\n                ○​ you should call the on-call pediatric dentistry resident at the University of Illinois Hospital at (312) 996-7297\n                ○​ there is a substantial charge for services in the hospital emergency department and patients should be informed\n                     that they will be billed by the hospital and by the ER physicians; dentists/residents are unable to waive the\n                     emergency fees from the University of Illinois Hospital"
},
{
"id": "c097.0",
"section": "POLICIES",
"title": "INCIDENTS (OCCURRENCES) — guidelines",
"body": "guidelines\n    ●​ students should report incidents promptly to the supervising instructor & managing partner to seek advice and assistance in\n         managing the situation\n    ●​ report the incident to the Patient Experience Advocate or Associate Dean for Clinical Affairs\n    ●​ complete an incident report & bring it to Room 301\n            ○​ incident forms are located on the COD Intranet site under Clinic Chairside → Report an Occurrence (link)\n\nneedlestick\n   ●​ give yourself immediate wound care (wash with soap & water or flush eyes with water)\n   ●​ inform the patient\n   ●​ inform the immediate supervisor or the Office for Clinical Affairs (Room 301) of the incident\n   ●​ conclude the procedure in progress as soon as is reasonable without compromising patient care, or arrange to have it\n        completed\n   ●​ obtain verbal consent from the patient for testing for serologic evidence of HBV, HCV, & HIV infection — written consent is\n        not required\n   ●​ take the patient to PG Oral Surgery to have their blood drawn\n             ○​ for adult patients, obtain two 10 mL red topped tubes\n             ○​ for pediatric patients, consult the patient’s pediatrician and the University laboratory staff as needed to determine\n                 whether to test and, if so, the amount of blood to draw\n   ●​ immediately take the blood specimen (in a ziplock bag labeled “biohazard” & labeled with the patient’s name & Axium\n        number) to the University Health Services (UHS) or to the Emergency Services Department (ESD), depending on day & time\n             ○​ 7:30 AM - 3:00 PM → report to University Health Services (UHS) — Medical Science Building, 835 S. Wolcott Ave.\n                 (Room E144)\n             ○​ outside these hours → report to UIH Emergency Service Department (ESD) — 714 W. Taylor St. E\n   ●​ obtain results and interpretation of source patient’s test results\n   ●​ keep source patient’s test results confidential\n   ●​ complete an occurrence report, which are available on the Intranet (or in the Office for Clinical Affairs, Room 301) & have\n        the supervising instructor sign the form\n   ●​ if you receive a bill, send it to: Office of Clinical Affairs, UIC College of Dentistry (MC 621), 801 South Paulina Street, Room\n        301, Chicago, IL. 60612 — Phone: 312-996-1036\n\nswallowed or inhaled object\n    ●​ inform the attending faculty & the patient of the concern that they swallowed or aspirated an object\n    ●​ fill out a Patient Occurrence Report (found on the Intranet) and bring to room 301\n    ●​ fill out entry in the patient’s record in Axium\n    ●​ fill out a Request for Consultation (found on the Intranet)\n    ●​ escort the patient to the University of Illinois Medical Center Emergency Department (1740 West Taylor Street)\n    ●​ the College of Dentistry will cover the costs for all diagnostic tests and related services\n    ●​ the patient should always be reassured why the hospital visit is a necessary safety precaution and that the College will\n       absorb all costs related to this hospital visit\n    ●​ if the patient receives a bill they should immediately send it to: Office of Clinical Affairs, UIC College of Dentistry (MC 621),\n       801 South Paulina Street, Room 301, Chicago, IL. 60612 — Phone: 312-996-1036\n\nPATIENT FAILURE, INACTIVATION, & DISMISSAL\n\n    ●​ appointment change status (cancelled, failed, etc.) will be recorded in Axium (see below)\n    ●​ request that the clinic manager send a designated letter based on their status (table) — request in clinic manager’s binder\n            ○​ the letter will be attached to the patient’s electronic record\n            ○​ a note will be made in the contact note area indicating that a letter has been sent\n    ●​ types of patient letters:\n        Letter A provider unable to contact\n         Letter B    1st time failed or late (20 min) appointment\n         Letter C    2nd time failed or late (20 min) appointment\n         Letter D    letter of dismissal\n         Letter F    failed initial appointment — letter of dismissal\n         Letter H    patient is unsuitable for teaching & learning environment — letter of dismissal\n         Letter I    patient is no longer interested in care — patient inactivation\n          Letter S unable to schedule appointment — patient inactivation\n    ●​   if the provider is unable to contact a patient, Letter A will be sent to the patient & the patient’s status will be changed to\n         inactive until the patient contacts the college to continue care\n    ●​   patients who fail appointments, cancel with less than 24 hours notice, or have been late for appointments will be sent Letter\n         B and/or C warning of non-compliance with college policy\n              ○​ if patients are noncompliant after adequate warning, they can be dismissed from the college with proper notice\n                   (Letter D)\n              ○​ the patient status will be changed to “dismissed with 30 day urgent care parameter” or “dismissed/do not readmit”\n                   by the managing partner\n                        ■​ emergency care will be provided for 30 days, copies of records & a referral list will be offered\n    ●​   patients who have failed an initial appointments (i.e. COE, radiology, consult) may be dismissed from the college (Letter F)\n    ●​   patients who are unsuitable for a teaching and learning environment and/or are disruptive will be dismissed (Letter H)\n              ○​ emergency care will be provided for 30 days, copies of records & a referral list will be offered\n    ●​   patients that have indicated that they will discontinue treatment will be sent a follow up letter for confirmation; if there is\n         no further communication from the patient, the patient status will be changed to inactive (Letter I)\n    ●​   patients who cancel appointments repeatedly greater than 24 hours notice, will be inactivated (Letter S) until patient can\n         commit to an appointment\n    ●​   treatment will be discontinued if a patient indicates that they intend to file or file a claim (any mention of a lawyer) against\n         the UIC-COD or its providers (Letter D); the patient status will be changed to “dismissed”.\n              ○​ emergency care will be provided for 30 days, copies of records & a referral list will be offered\n    ●​   patients dismissed from any clinic at the UIC-COD are dismissed from receiving care from all clinics within UIC-COD\n\ninactivation\n    ●​ “Hi, this is Sarah from the UIC College of Dentistry, I’m calling for [patient name]. I was calling to let you know that you’re\n         due to for an exam with me at the dental school. I’ve been having some trouble contacting & scheduling you, so I just\n         wanted to let you know that this will be the last time I’ll be calling. At this point your chart will be temporarily put on hold,\n         so I won’t be actively calling you any more, however whenever you are available & you want to schedule your treatment,\n         just give me a call or text at this number and we’ll get you scheduled. Thanks!”"
},
{
"id": "c098",
"section": "POLICIES",
"title": "PATIENT RECORDS",
"body": "●​   if a patient or their lawyer requests copies of records, refer them to the Office of Records and Registration, Room 103\n   ●​   a written request and release, signed by the patient, is required — link to records request form\n   ●​   the fee for copying records is based on the records requested and route of delivery\n   ●​   under no circumstances should student dentists print copies of records be copied for patients"
},
{
"id": "c099.0",
"section": "AXIUM",
"title": "LAB SCRIPT — Required items for submitting a case to the dental lab",
"body": "Required items for submitting a case to the dental lab\n\nfilling out a lab script\n      1.​ select your patient in Rolodex & open their EHR​\n\n    2.​ click the “Labs” tab​\n\n    3.​ click the plus (right)​\n        ​\n\n    4.​ choose your clinic next to “Discipline” ​\n        ​\n\n    5.​ click the “...” next to “Treatment”​\n        ​\n        ​\n        ​\n\n    6.​ select the appropriate treatments​\n        ​\n\n    7.​ click the “...” next to “Lab Proc” ​\n        ​\n\n    8.​ select the procedure ​\n\n    9.​ click “Add”​\n\n    10.​ click “OK”​\n\n    11.​ write your lab script next to “Details”​\n\n    12.​ click the plus (center)​\n\n    13.​ click the “...” next to “Supplements”​\n\n    14.​ add all of the materials you’ll be sending to the lab (select in left column, then click the > arrow to add it to the right\n         column) — see Required items for submitting a case to the dental lab​\n\n    15.​ click “Close”​\n\n    16.​ click the pencil check mark (“Modify Record”) to save the info​\n\n    17.​ have instructor swipe form​\n         ​\n\n    18.​ print the form ​\n\n    19.​ have instructor sign the printed form​\n\n    20.​ if a lab script for a partial denture, draw the partial denture design on the printed form​\n\n    21.​ bring the lab script + supplements to the 5th floor lab​\n\n    22.​ you will get an Axium message when the info has been sent to the lab; you will get another Axium message when the item is\n         back from the lab & ready for pickup\n\ntooth requisition (requesting denture teeth)\n    1.​ select your patient in Rolodex → open their EHR → click the “Forms” tab​\n\n    2.​ click the plus (right) to add a form ​\n\n    3.​ choose “Tooth Requisition” (TOOREQ) then click OK ​\n        ​\n\n    4.​ fill out the appropriate parts of the form (example)\n              ○​ if you are requesting all of the anteriors,\n                   write “1x6” next to “Teeth” (indicating you\n                   want all 6 anteriors)\n              ○​ if you are requesting all of the posteriors,\n                   write “1x8” next to “Teeth” (indicating you\n                   want all 8 posterior teeth)​\n                   ​\n\n    5.​ have instructor            swipe form​\n\n    6.​ print the form ​\n\n    7.​ have instructor sign the printed form​\n\n    8.​ take the signed form to the 5th floor lab, and the lab will give you the teeth (if they don’t have them in stock, they will order\n        them)\n\nlab script example: complete dentures\n F/F: Please festoon, pack, and process maxillary & mandibular complete dentures. Gingival shade: X. Please return for delivery. Thank you.\n\nlab script example: interim immediate dentures\n F/F: Please fabricate maxillary and mandibular interim complete dentures. Use existing teeth #6, #11 and #22, 27 as reference. #6, #11, #22, #27\n will be extracted. Please set posterior teeth over the residual ridge and do not increase VDO. Please use Trubyte Classic anterior tooth mold 4H\n and posterior teeth mold F30 10º. Please use tooth shade 81 for all teeth. Please use acrylic shade: 50% OR (original) + 50% DK (dark). Please set\n teeth, festoon, process & polish, and return for delivery. Thank you."
},
{
"id": "c099.1",
"section": "AXIUM",
"title": "LAB SCRIPT — lab script example: lab reline",
"body": "lab script example: lab reline\n F/: Please reline the denture with heat-cured acrylic resin, shade L199-OR. Please add the posterior palatal seal as indicated on the impression.\n Please polish and return for delivery. Thank you.\n\nlab script example: partial dentures\n Please fabricate mandibular RPD framework using Vitallium alloy.\n Major connector: lingual bar.\n Rest seats: #21-MO, #28-DO.\n Guide planes: #21-D, #28-D.\n Clasps:\n - 18 gauge wrought wire circumferential clasp engaging 0.02 MB undercut #21\n - 18 gauge wrought wire reciprocal arm on lingual of #21\n - 18 gauge wrought wire circumferential clasp engaging 0.02 MB undercut #28\n - 18 gauge wrought wire reciprocal arm on lingual of #28\n Tissue stops marked on cast.\n Retentive loops on areas: #18, 19, 20, 29, 30.\n Return framework for try-in.\n Thank you.\n\nlab script example: interim immediate partial dentures\n Please fabricate mandibular interim immediate acrylic removable partial denture. Use existing teeth #22-28 as a reference for occlusal plane. #18\n and #28 will be extracted. Please set posterior teeth over the residual ridge and do not increase VDO. Please place wrought wire clasps on #22\n\n and #27. Please use Trubyte classic posterior tooth mold F30 10º, tooth shade 81. Please use acrylic shade: 50% OR (original) + 50% DK (dark).\n Please set teeth, festoon, process & polish, and return for delivery.\n Thank you.\n\nlab script example: PFM crown\n Please pour impression & fabricate PFM crown for #30 using high-noble alloy.\n Occlusal and interproximal contacts should be in porcelain.\n 1-2 mm metal collar on the lingual margin, no metal collar on the buccal margin.\n Shade A2.\n Thank you.\n\nlab script example: implant working cast\n Please pour final impression & create soft tissue cast for implant-supported crown, #7.\n Implant replica is provided for Straumann Implant diameter 4.8 mm.\n Please return working cast for mount.\n Thank you.\n\nlab script example: custom abutment for implant\n Please fabricate an Atlantis custom abutment for Straumann Implant diameter 4.8 mm for #19.\n Abutment type: titanium (or gold-hue, or zirconia)\n Emergence profile: default\n Planned Crown: cement-retained CAD/CAM emax (or cement-retained PFM, or cement-retained full gold crown)\n Thank you.\n\nlab script example: implant crown\n Please fabricate all-ceramic emax CAD/CAM crown (lithium disilicate) for site #14 (Dentsply EV 4.8mm): Shade LT A2. Please crystalize and return\n it for delivery. Thank you\n\nlab script example: bridge working cast\n Please pour impression for PFM bridge from #28-30.\n Please section dies & return working cast for mounting.\n Thank you.\n\nlab script example: bridge\n Please fabricate PFM bridge from #28-30 using high-noble alloy.\n Occlusal and interproximal contacts should be in porcelain.\n 2-3 mm metal collar on the lingual margins, no metal collar on the buccal margins.\n Modified ridge lap pontic design.\n Please return metal framework for try-in.\n Thank you.\n\nlab script example: adding porcelain to metal framework\n Please apply porcelain to metal framework for PFM bridge from #28-#30.\n Shade A2.\n Thank you.\n\nlab script example: occlusal guard\n Please fabricate maxillary full arch flat plane occlusal guard. Please process in dual layer acrylic with VDO raised to create at least 1 mm space\n measured between the tips of the canines & all posterior teeth during eccentric movements (pin +3 mm). Please achieve all of the following:\n (a) point-to-flat-plane contact in centric (buccal cusps & incisal edges of mandibular teeth)\n (b) 1-2 mm of freedom in centric\n (c) minimal incisal guidance, but enough to disclude posterior teeth in protrusion\n (d) canine guidance during lateral excursion\n Please return for delivery. Thank you.\n\nlab script example: custom abutment for implant\n Please fabricate a Straumann custom abutment for #13.\n Implant: Straumann brand, diameter 3.6 mm.\n Abutment type: Titanium\n Emergence profile: Default\n Planned crown type: cement-retained, all-ceramic e.max CAD/CAM crown\n\nlab turn-around time\n                   model work\n\n                   reline\n5 business days\n                   acrylic-only denture or partial repair\n\n                   cast pattern for post & core\n\n                   rebase denture or partial\n\n                   patrial framework\n\n                   denture teeth set-up\n\n                   acrylic processing for denture or partial\n\n                   PFM bridge metal try-in\n\n9 business days    porcelain application to metal try-in\n\n                   metal crown, inlay, onlay\n\n                   night guard\n\n                   wax and cast post & core (from impression)\n\n                   partial repair with soldering\n\n                   solder PFM bridge\n\n                   PFM crown\n\n12 business days   ceramic crown, inlay, onlay, veneers\n\n                   implant crown"
},
{
"id": "c100",
"section": "AXIUM",
"title": "PRESCRIPTIONS",
"body": "1.​ select patient & open Axium eRx (follow Step 1 through Step 3 in AXIUM eRx (MEDICATIONS & ALLERGIES)​\n\n   2.​ in the top-center of the screen, click the magnifying glass to select a pharmacy​\n\n                                                                                           ​\n\n   3.​ click “Create New Prescription” (top-center of screen)​\n\n   4.​ search the appropriate drug and complete all the fields, then click “Review”​\n\n                                                                                                                 ​\n\n   5.​ on the next screen, click “Save Pending Rx”​\n\n   6.​ close Axium eRx​\n\n   7.​ have instructor swipe prescription:​\n\na.​ have the instructor open Axium eRx Authorized User Signin​\n\n                                                                 ​\n\nb.​ scroll down under the “Prescription Management” heading​\n\n                                         ​\n\nc.​ have the instructor click the check box next to the prescription​\n\n                                                             ​\n\nd.​ have the instructor type their signature password in the box next to “Signature Password”\n        ○​ the password is usually the faculty’s pin number\n        ○​ otherwise, the default password is instructor’s first name followed by “rx” or instructor’s last name\n            followed by “rx” (all lowercase)\n\n                                                                                           ​\n\ne.​ to send the prescription electronically, click “Send”​\n\nf.​   to print the prescription, click “Print don’t Send”\n           ○​ prescriptions need to be printed on prescription paper — make sure you select the appropriate printer!\n                the printer should say “Rx” or “Prescription”\n                    ○​ in Vivaldi or Chicago, the prescription printer is in the UG OS front desk\n                    ○​ in 2nd floor clinics, the prescription printer is at the 2nd floor front desk"
},
{
"id": "c101",
"section": "AXIUM",
"title": "MEDICAL CONSULTATION",
"body": "writing a med consult\n    1.​ plan the code D9390 (Medical Consultation)\n    2.​ complete the sub-code D9390A (Request)\n    3.​ complete the Form CONS — a window will pop up & allow you to add the appropriate form (if the window does not pop up:\n         right click on D9390A (Request) and click “Add/Edit Tx Form…” → next to “Form,” select “CONS” then click OK)\n              ○​ next to consultant, put the name or title of the physician (“Dr. Smith” or “Neurologist”)\n              ○​ the treatment form will auto-create a medical consult note if you select one of the conditions listed; you don’t\n                   have to type a note — you’ll see this auto-generated note once you print the form\n              ○​ if you are requesting a medical consult for a condition not on the list (“Other”) —or— if you want to add your own\n                   note, select “Other” for consult reason & type a note in that field\n              ○​ example note (not required! only if you want to add):\n                  Our mutual patient presents to UIC College of Dentistry for routine dental procedures & surgical dental\n                  procedures under local anesthetic. He reports diagnoses of [x]. He reports that he is taking the following\n                  medications: [x].\n\n                  The patient reports that his last HbA1c was [x]. Could you report his most recent HbA1c? Could you please also\n                  comment on his diabetic control?\n\n                  The patient reports that his last CD4 count was [x] and his last viral load was [x]. Could you report his most\n                  recent CD4 & viral load?\n\n                  Could you please comment on his ability to heal from routine or surgical dental procedures?\n\n                  Please include any comments or information regarding our patient's ability to tolerate routine dental care as you\n                  see fit. Please indicate if the patient is medically optimized to receive dental treatment. Thank you.\n             ○​ make sure you select “Yes” next to the “form printed for patient” field\n    4.​ have instructor swipe\n    5.​ print the medical consult form & give it to the patient; have them bring it to their doctor & return to the next appointment\n        with the form completed\n\nwhen pt returns with completed med consult\n   1.​ complete (C) the subcode D9390B (Response)\n             ○​ a window will pop up & allow you to add the appropriate form\n   2.​ fill out the physician’s response in the medical consult form on Axium\n   3.​ bring the completed form to the front desk so that they can scan it into Patient Attachments"
},
{
"id": "c102",
"section": "AXIUM",
"title": "REFERRALS",
"body": "completing a referral in Axium\n   1.​ click the “Forms” tab​\n\n                    ​\n\n    2.​ click the plus sign (right)​\n\n                ​\n\n    3.​ next to “Form,” select “REFER - Referral To Another Dept” from the drop down menu; click OK​\n\n                                                                        ​\n\n    4.​ fill out the referral form — copy the “Reason for the referral” so that you can paste it later​\n\n                                                                                                          ​\n        ​\n\n    5.​ have instructor swipe​\n\n    6.​ click the running man icon (right)\n             ○​ paste the “Reason for the referral” text into\n                  the “Comment” box\n             ○​ under “Assigned To: Message Group,” click\n                  the “...” to select the department you are\n                  referring to; click OK\n\nNO-SHOW / CANCEL <24 HRS\n\nwhen a patient fails their appointment — no show or cancels less than 24 hours before\n   1.​ open the patient’s EHR & complete code D9425 (NO SHOW)\n   2.​ attach a note to the code & explain what happened (pt did not show without notice, pt cancelled via text 2 hrs before, etc.)\n   3.​ go to the Scheduler → “Weekly” tab → right click the appointment & click “Failed”\n   4.​ write a contact note explaining what happened\n   5.​ in clinic, go to the bay & cross your patient off the appointment papers posted on the bulletin board (so your instructor\n        knows your patient is not coming)\n   6.​ go to clinic manager’s binder & send the appropriate letter\n\nPREVIDENT, CHLORHEXIDINE, MI PASTE\n\n   1.​ determine if patient’s insurance will cover the payment\n             ○​ go to the front desk & ask\n             ○​ if not covered, $10\n   2.​ tell the patient how much it will cost\n   3.​ complete (C) the appropriate code:\n             ○​ D9630.1 = PreviDent 5000\n             ○​ D9630.2 = Chlorhexidine\n             ○​ D9630.4 = MI paste\n   4.​ have the instructor swipe the code\n   5.​ bring the patient to the front desk to accept payment & get a card from the front desk\n\n   6.​ bring the patient & the card to sterilization to redeem the card for the product\n           ○​ for PreviDent, sterilization will also give you a paper prescription\n\n            ○​ give the paper prescription to the patient — the paper prescription allows the pt to get PreviDent at a local\n               pharmacy if they run out between appointments"
},
{
"id": "c103",
"section": "AXIUM",
"title": "TOBACCO CESSATION",
"body": "1.​ complete the 2 codes:\n           ○​ D1230.1 (Record Tobacco Usage)\n           ○​ D1230.2 (Provide Tobacco Cessation Education)\n  2.​ follow the pop-up prompts after completing the D1230.1 code to add the tobacco form\n  3.​ complete the form\n           ○​ if pt is interested in quitting, tobacco cessation materials can be found on the Intranet (under “Tobacco/Smoking\n               Cessation Resources”)\n  4.​ at the next visit, complete the last section of the form, “Follow-Up” then complete code D1230.3 (Tobacco Cessation Follow\n      Up with Patient)"
},
{
"id": "c104",
"section": "AXIUM",
"title": "PROSTHETIC JOINT FORM",
"body": "if patient has a prosthetic joint:\n     1.​ when going through the medical history & the patient says the have a prosthetic joint, the first thing you should do is click\n          “Links” at the top, then click “AAOS Appropriate Use Criteria Tool”​\n\n                                                                      ​\n\n    2.​ fill out the forms on the AAOS website → the AAOS website will give recommendations​\n\n    3.​ print the completed AAOS form & recommendations — after it is printed, write in the date, patient name, patient DOB​\n\n    4.​ exit & go back to Axium​\n\n    5.​ in the patient’s “Medical History” tab (EHR → “Forms” tab), under “Bones/Muscles/Joints,” select “Prosthetic Joint\n        Replacement”​\n\n                                                                                                                                    ​\n\n    6.​ when you check this, the “Prosthetic Joint Replacement” window will pop up​\n\n                                                                                                                                          ​\n\n    7.​ under “Comments,” include the following information: (1) which joint, (2) when was surgery, (3) has the joint ever had an\n        infection that required surgery​\n\n    8.​ use the drop down menu to select the AAOS treatment recommendations​\n\n    9.​ bring the printed form to the front desk & ask them to scan it into the patient’s chart"
},
{
"id": "c105",
"section": "AXIUM",
"title": "ADDING PHOTOS",
"body": "1.​ check out the digital camera from sterilization & take photos​\n\n   2.​ when you’re done taking photos & ready to upload: turn the camera off → use the USB cable to connect the camera to the\n       computer → turn the camera on → select “Storage” on the camera​\n\n   3.​ open Dexis​\n\n   4.​ select the camera icon at the top​\n\n   5.​ select the import icon at the top (or, you can right click the screen and select “Import”)​\n\n   6.​ select “Browse”​\n\n                                                                                                                     ​\n\n   7.​ select the digital camera DCIM folder​\n\n   8.​ hold down the Command key and select all your photos​\n\n   9.​ click “Import Selected”​\n\n                               ​\n\n   10.​ once imported, unplug the camera, and delete all images from the camera! to avoid HIPAA violations"
},
{
"id": "c106",
"section": "AXIUM",
"title": "ADDING RADIOGRAPHS",
"body": "1.​ locate the x-ray files & save them to the computer; or, plug in the flash drive containing the x-ray files​\n\n   2.​ open Dexis​\n\n   3.​ select the FMX or Panoramic icon at the top (depending on if you are uploading individual x-rays or panos)​\n\n                        ​\n\n   4.​ select the import icon at the top (or, you can right click the screen and select “Import”)​\n\n                ​\n\n   5.​ select “Browse”​\n\n                                                                                                                     ​\n\n   6.​ select the folder with the x-ray files​\n\n   7.​ hold down the Command key and select all your photos​\n\n   8.​ click “Import Selected”​\n\n   9.​"
},
{
"id": "c107",
"section": "AXIUM",
"title": "CREATING A NEW PERIO CHART",
"body": "1.​ open a new perio chart by clicking “Perio Chart” on the Axium sidebar​\n\n                                             ​\n       ​\n\n   2.​ click the plus at the top of the perio chart ​\n       ​\n\n   3.​ select the proper procedure next to “Exam Type”​\n\n                                                   ​\n\n   4.​ MAKE SURE YOU CLICK SAVE BEFORE EXITING OR EVERYTHING WILL BE LOST AND YOU MIGHT CRY IN FRONT OF EVERYONE\n\nAXIUM eRx (MEDICATIONS & ALLERGIES)\n\nAXIUM eRx\n   1.​ select patient (Rolodex) & open EHR​\n       ​\n   2.​ click “Medications” tab​\n\n                         ​\n       ​\n   3.​ click the plus sign (right) then click “Axium eRx”​\n\n                                                                ​\n\nMEDICATIONS​\n   1.​ scroll down → under “Medications,” click the button that says “Show Medication History”​\n\n                                                                                               ​\n       ​\n\n   2.​ from the “Select time period...” drop down menu, select “1 year” → the pt’s drug history will be displayed, showing all\n       prescriptions the pt has filled within the last year​\n\n                                                                                           ​\n\n   3.​ use the check boxes to select the medications that the patient is currently taking, then select “+ Add to Active Medications”​\n\n                                                                        ​\n       ​\n   4.​ to add additional medications to the pt’s medication list, click “Add Medication,” then search for & find the appropriate\n       medication — don’t worry about entering the specifics, just get the name of the drug (and dose, if the pt knows)​\n\n                                  ​\n\n   5.​ once the pt’s medication list is complete, click the check mark next to “Complete”​\n\n                                                                            ​\n\n   6.​ if the patient does not take any medications, click the hammer next to “Unknown or Incomplete”​\n\n                                                                                             ​\n\n   7.​ select “Complete” from the drop-down menu, then click “Confirm Review”​\n\n                                                                  ​\n       ​"
},
{
"id": "c108",
"section": "AXIUM",
"title": "ALLERGIES",
"body": "1.​ scroll down → under “Allergies”​\n       ​\n\n   2.​ if patient does not have any allergies, click “Mark patient NKDA”​\n\n                                           ​\n\n3.​ if patient does have allergies, click the “+” to add their allergies​\n\n                           ​\n\n4.​ when you’re done, click the check mark ​\n\n                                  ​"
},
{
"id": "c109.0",
"section": "AXIUM",
"title": "CALLING PATIENTS — do your research on the patient",
"body": "do your research on the patient\n    ●​ determine if the patient is an active patient or a recall patient\n    ●​ active patients:\n            ○​ review the patient’s chart & contact notes\n            ○​ take note of what treatment phase the patient is in\n            ○​ determine when the pt was last seen & what the next visit was planned to be\n            ○​ you have 3 options as to what type of appointment the patient should be scheduled for:\n                      ■​ exam (COE/POE/OV)\n                      ■​ cleaning (perio maintenance or prophy)\n                      ■​ active treatment (continuing pt’s established tx plan)\n            ○​ if you/the pt would rather get to know each other first, schedule the pt for an exam (COE/POE/OV) or for a cleaning\n                 (perio maintenance or prophy)\n                      ■​ scheduling for an exam:\n                               ●​ if COE/POE was less than 6 months ago, you can schedule patient for an Office Visit (D0105)\n                               ●​ if COE/POE was more than 6 months ago, you can schedule patient for a POE (D0120)\n                               ●​ if patient does not have a COE completed (they were recently screened), check Dexis to see if\n                                    they have had an FMX & pan taken\n                                         ○​ if patient has had the FMX & pan taken, schedule patient for a COE (D0150)\n                                         ○​ if patient has not had the FMX & pan taken, call them & give them the phone number\n                                               for radiology, (312)-996-6477, and remind them that before you can see them they will\n                                               need to get their x-rays taken (don’t forget to enter a contact note)\n                                         ○​ patients without FMX/pan cannot be seen in clinic until the radiographs are taken!\n                      ■​ scheduling for a cleaning:\n                               ●​ if pt’s last cleaning was SRP, see when it was done & if the re-eval has been completed\n                                         ○​ if re-eval was completed, check perio maintenance interval (Forms → Perio EPR →\n                                               Treatment Plan Tab → scroll to bottom to see “Recall Interval”) — if pt is due, schedule\n                                               for perio maintenance (D4910)\n                                         ○​ if the re-eval was not completed, schedule the pt for re-eval (D0170)\n                               ●​ if pt’s last cleaning was perio maintenance, see when it was done & check the perio maintenance\n                                    interval (Forms → Perio EPR → Treatment Plan Tab → scroll to bottom to see “Recall Interval”) to\n                                    see if pt is due → if pt is due, schedule for perio maintenance (D4910)\n                               ●​ if pt’s last cleaning was prophy, see when it was done & check the prophy interval (Forms → Perio\n                                    EPR → Treatment Plan Tab → scroll to bottom to see “Recall Interval”) to see if pt is due → if pt is\n                                    due, schedule for prophy (D1110)\n            ○​ scheduling for treatment:\n                      ■​ if the pt is eager to continue treatment, and they have been recently seen by their previous student\n                          dentist, and everything seems straightforward with the treatment plan, feel free to schedule the pt for\n                          their next needed treatment (filling, crown prep, RPDs, etc.)\n    ●​ recall patients:\n            ○​ review the patient’s chart and contact notes\n            ○​ determine when the pt’s last POE & cleaning were (perio maintenance/prophy)\n            ○​ read here to determine whether to schedule pt for POE/prophy/perio maintenance\n            ○​ if a recall patient is not due yet, don’t schedule them yet! wait until they are due — but, you should call & introduce\n                 yourself right away so that if they have a problem in the meantime they know who to contact\n    ●​ check to make sure the patient is not already scheduled\n            ○​ under Tx History tab, green appointments at the bottom with an “S” under the “Status” column are scheduled\n                 appointments; green appointments with “RC” under the “Status” column are computer-generated recall reminders,\n                 they are not scheduled appointments\n    ●​ be aware of recent treatments, last contact with someone at UIC, alternate phone numbers, language barriers, etc.\n    ●​ check the pt’s treatment plan so you can be prepared for the cost of the next visit, in case the pt asks\ncalling a patient\n     ●​ calling a patient:\n              ○​ Hi, this is Sarah calling from the UIC College of Dentistry, is John available? I was just calling to introduce myself, I’m\n                  your new student dentist. I was looking through your chart and noticed that you are due for an exam and cleaning.\n                  Are you interested in setting up an appointment at this time to get that completed? Great, is there a certain day of\n                  the week that works best for you? Do you prefer morning or afternoon appointments? Just so you are aware, the\n\n              fee for this appointment will be $72. Perfect, I will see you on Wednesday, August 2 at 1:30. We’ll be on the 3rd\n              floor in Vivaldi clinic. You can check in on the 3rd floor in room 321. Please call me and let me know if you are\n              unable to make it to this appointment, you can call or text me at 708-669-9449. Is this a cell phone / do you want\n              me to text you a confirmation with this information?\n●​   information to include in phone call:\n          ○​ know the fee for the visit in case the patient asks\n          ○​ asthma / bronchitis — remind pt to bring inhaler\n          ○​ antibiotic prophylaxis — see if patient has antibiotics at home (if not, write Rx), remind the pt to take them 1 hour\n              before appointment\n          ○​ remind patient that if they need to cancel, they should text or call you at least 24 hours in advance\n●​   leaving a message:\n          ○​ “Hello, this message is for John. This is Sarah calling from the UIC College of Dentistry, I was just calling to introduce\n              myself as your new student dentist. I am calling to set up your next appointment, so please give me a call or text\n              back at this number whenever you get a chance, 708-669-9449. Thank you!”\n          ○​ always leave a message; Google Voice numbers are foreign so the patient may not answer or call back unless you\n              leave a message\n●​   don’t violate HIPAA if a family member answers:\n          ○​ “Please let [patient] know that Sarah called from the UIC College of Dentistry. They can call or text me back at\n              708-669-9449.”\n●​   every time you call a patient you need to document an entry in the contact notes in Axium (below)"
},
{
"id": "c110",
"section": "AXIUM",
"title": "BOOKING A CHAIR",
"body": "1.​ open Scheduler (in the sidebar, left)​\n\n                                         ​\n\n   2.​ click the “Weekly” tab on the right ​\n\n             ​\n\n   3.​ determine where you have an opening & want to schedule the pt — use the bottom buttons to navigate through the weeks\n\n                                                                                     ​\n\n   4.​ click the “Chair” tab on the right​\n\n              ​\n\n   5.​ click the open book icon on the right to select your clinic (double click)​\n\n                  ​\n\n                                             ​\n\n   6.​ use the bottom buttons to navigate to the day you want​\n\n   7.​ click the times on the left to navigate the appointment time​\n\n                      ​\n\n   8.​ determine if the chair you want is available (Perio, Restorative) — white chairs are available, colored chairs are unavailable\n           ○​ red chair = another student has a pt booked in that chair\n           ○​ blue chair = another student has a pt booked in that chair & the pt has confirmed the appointment\n           ○​ yellow chair = another student has selected that chair & is holding it, but no pt is booked\n           ○​ white chair = open​\n\n                            ​\n\n9.​ click the chair you want (it will turn green) — make sure you have the right date & time​\n\n               ​\n\n10.​ click back to the “Weekly” tab on the right ​\n\n11.​ the date & time you selected will now appear tan on the weekly view; click on it​\n\n                                ​\n\n12.​ double click the patient you want to schedule​\n\n13.​ under “Reason,” type the procedure you are going to perform & type your instructor request\n        ○​ example: “Dr. Afshari — #19-B composite”​\n\n14.​ next to “Appt. Code,” select the length of the appointment​\n\n                                           ​\n\n15.​ click “Accept” ​\n\n                            ​\n\n16.​ move the appointment code(s) from the “Planned Treatments” column (left) to the “Appointed Treatments” column (right)\n     by double clicking or by selecting and clicking the > arrow\n         ○​ note: it does not matter what appointment code you choose! if you can, choose the right one(s), but if there is no\n             code for the procedure you’re doing, just chose ANY code at all — you’ll type what you’re doing in the “Reason”\n             box anyway\n\n                                                                                                                                 ​\n\n17.​ click “Close”​\n\n                        ​\n\n    18.​ the tentative appointment will show up in yellow​\n\n                                        ​\n    19.​ drag the yellow appointment to the tan open slot (position it so that the start time is correct)​\n\n    20.​ double click the appointment → it will change from yellow to white​\n\ncolors\n    ●​ chair colors in the “Chair” tab on the Scheduler:\n           ○​ red chair = another student has a pt booked in that chair\n           ○​ blue chair = another student has a pt booked in that chair & the pt has confirmed the appointment\n           ○​ yellow chair = another student has selected that chair & is holding it, but no pt is booked\n                      ■​ if you want to book this chair, right-click then select “Un-reserve chair”\n           ○​ white chair = open\n           ○​ red text = pt has checked in\n    ●​ appointment colors in the “Weekly” tab on the Scheduler:\n           ○​ green — patient is scheduled\n           ○​ blue — patient is scheduled & appointment has been confirmed\n           ○​ red — patient is here & checked in"
},
{
"id": "c111",
"section": "AXIUM",
"title": "CONTACT NOTE",
"body": "1.​ open the Rolodex & select the patient​\n\n  2.​ click the patient notecard in the middle of the screen​\n\n                                                                ​\n      ​\n  3.​ click the “Contact Notes” icon at the top​\n\n                                   ​\n      ​\n  4.​ type in the box under “Note”​\n      ​\n\n  5.​ click the plus sign to add the contact note​"
},
{
"id": "c112",
"section": "AXIUM",
"title": "REMOVING AN AXIUM ABSENCE",
"body": "●​ if you were at school but forgot to log in & get an absence, you can ask your clinic manager to remove it\n  ●​ clinic manager needs to email (not Axium message): CODaxiumsupport@uic.edu\n          ○​ include the following information:\n                   ■​ student first & last name\n                   ■​ date & session (AM/PM) of absence"
}
];

const RVU_DATA = [
  { code: "D0101", desc: "Phase 1 Reevaluation", rvu: 1 },
  { code: "D0102", desc: "Phase 2 Reevaluation", rvu: 1 },
  { code: "D0103", desc: "Phase 3 Reevaluation", rvu: 10 },
  { code: "D0106", desc: "UG implant recall exam-OD", rvu: 1 },
  { code: "D0107", desc: "UG implant recall exam-STI", rvu: 1 },
  { code: "D0120", desc: "Periodic oral evaluation", rvu: 2 },
  { code: "D0140", desc: "Limited oral eval-prob focused", rvu: 2 },
  { code: "D0146", desc: "Limit oral eval-prob focus N/C", rvu: 2 },
  { code: "D0147", desc: "Screening N/C", rvu: 1 },
  { code: "D0150A", desc: "Initial Assessments", rvu: 3 },
  { code: "D0150B", desc: "Additional Assessments", rvu: 3 },
  { code: "D0150C", desc: "Tx Plan Developed", rvu: 1 },
  { code: "D0160", desc: "Detailed Ext. oral eval", rvu: 3 },
  { code: "D0170", desc: "Re-Eval.-limited, prob. focus", rvu: 5 },
  { code: "D0170C", desc: "Perio Re-evaluation Competency", rvu: 4 },
  { code: "D0171", desc: "Re-evaluation - post-operative office visit", rvu: 2 },
  { code: "D0180", desc: "Comprehensive Perio Eval", rvu: 2 },
  { code: "D0180C", desc: "Perio Clinical Eval Competency", rvu: 2 },
  { code: "D0180S", desc: "Comprehensive Perio Eval for screened patients", rvu: 2 },
  { code: "D0210", desc: "Intraoral-complete series", rvu: 4 },
  { code: "D0215", desc: "Intraoral-complete series N/C", rvu: 1 },
  { code: "D0220", desc: "Intraoral-periapical 1st film", rvu: 0.5 },
  { code: "D0225", desc: "Intraoral-periapical 1st N/C", rvu: 0.5 },
  { code: "D0230", desc: "Intraoral-periapical addl film", rvu: 0.5 },
  { code: "D0240", desc: "Intraoral - occlusal film", rvu: 0.5 },
  { code: "D0245", desc: "Intraoral - occlusal film N/C", rvu: 0.5 },
  { code: "D0270", desc: "Bitewing - single film", rvu: 0.5 },
  { code: "D0272", desc: "Bitewing - 2 films", rvu: 0.5 },
  { code: "D0273", desc: "Bitewing - 3 films", rvu: 1 },
  { code: "D0274", desc: "Bitewing - 4 films", rvu: 1 },
  { code: "D0275", desc: "Bitewing N/C", rvu: 0.5 },
  { code: "D0310", desc: "Sialography", rvu: 1 },
  { code: "D0320", desc: "TMJ arthrogram, incl injection", rvu: 2 },
  { code: "D0322", desc: "Tomographic survey", rvu: 2 },
  { code: "D0340", desc: "Cephalometric film", rvu: 2 },
  { code: "D0350", desc: "2D Oral/facial photog img obtained intra/extra orally", rvu: 2 },
  { code: "D0415", desc: "Bact. studies for path. agents", rvu: 1 },
  { code: "D0425", desc: "Caries susceptibility tests", rvu: 1 },
  { code: "D0431", desc: "Pre-diagnostic test (T-blue)", rvu: 1 },
  { code: "D0460", desc: "Pulp vitality tests", rvu: 1 },
  { code: "D0470", desc: "Diagnostic Casts", rvu: 1 },
  { code: "D0475", desc: "Diagnostic Casts N/C", rvu: 1 },
  { code: "D0486", desc: "Accession-brush biopsy/exam", rvu: 1 },
  { code: "D0601", desc: "Caries Risk Assessment and Documentation finding of low", rvu: 1 },
  { code: "D0602", desc: "Caries Risk Assessment and Documentation,finding of mod", rvu: 1 },
  { code: "D0603", desc: "Caries Risk Assessment and Documentation,finding of high", rvu: 1 },
  { code: "D0604", desc: "Caries Risk Documentation", rvu: 1 },
  { code: "D1110", desc: "Prophy - adult", rvu: 3 },
  { code: "D1120", desc: "Prophy - child", rvu: 3 },
  { code: "D1206", desc: "Topical fluoride varnish", rvu: 2 },
  { code: "D1206NC", desc: "Topical fluoride varnish - NoCharge", rvu: 2 },
  { code: "D1208", desc: "Topical application of fluoride-excluding varnish", rvu: 2 },
  { code: "D1208NC", desc: "Topical application of fluoride-excluding varnish-NoCharge", rvu: 2 },
  { code: "D1310", desc: "Nutritional counseling", rvu: 1 },
  { code: "D1320", desc: "Tobacco counseling", rvu: 1 },
  { code: "D1320.1", desc: "Record Tobacco usage", rvu: 1 },
  { code: "D1320.2", desc: "Provide Tobacco Cessation Education", rvu: 2 },
  { code: "D1320.3", desc: "Tobacco Cessation Follow Up with Patient", rvu: 1 },
  { code: "D1330", desc: "Oral hygiene instructions", rvu: 1 },
  { code: "D1351", desc: "Sealant - per tooth", rvu: 1 },
  { code: "D1354", desc: "Interim caries arresting medicament application-SDF", rvu: 2 },
  { code: "D1355", desc: "Sealant-per tooth N/C", rvu: 1 },
  { code: "D1510", desc: "Space maint - Fixed - Unilateral", rvu: 5 },
  { code: "D1511", desc: "Space maint - Fixed - Unilateral N/C", rvu: 5 },
  { code: "D1516", desc: "Space maintainer-fixed-bilateral, maxillary", rvu: 6 },
  { code: "D1517", desc: "Space maintainer-fixed-bilateral, mandibular", rvu: 6 },
  { code: "D1526", desc: "Space maintainer-removable-bilateral, maxillary", rvu: 3 },
  { code: "D1527", desc: "Space maintainer-removable-bilateral, mandibular", rvu: 3 },
  { code: "D1551", desc: "Re-cement or re-bond bilateral space maintainer - Maxillary", rvu: 1 },
  { code: "D1552", desc: "Re-cement or re-bond bilateral space maintainer - Mandibular", rvu: 1 },
  { code: "D1553", desc: "Re-cement or re-bond unilateral space maintainer - Per quad", rvu: 1 },
  { code: "D1556", desc: "Removal of fixed unilateral space maintainer-Per Quad", rvu: 1 },
  { code: "D1557", desc: "Removal of fixed bilateral space maintainer - Maxillary", rvu: 1 },
  { code: "D1558", desc: "Removal of fixed bilateral space maintainer - Mandibular", rvu: 1 },
  { code: "D2000DR", desc: "In Process or PO Restorative-Direct Restoration", rvu: 2 },
  { code: "D2000IR", desc: "In Process or PO Restorative-Indirect Restoration", rvu: 2 },
  { code: "D2000NC", desc: "In Process Step or PO Restorative", rvu: 2 },
  { code: "D2140", desc: "Amalgam - 1 surface", rvu: 3 },
  { code: "D2150", desc: "Amalgam - 2 surfaces", rvu: 4 },
  { code: "D2160", desc: "Amalgam - 3 surfaces", rvu: 5 },
  { code: "D2161", desc: "Amalgam - 4 or more surfaces", rvu: 5 },
  { code: "D2330", desc: "Resin-based comp-1 surf, ant.", rvu: 3 },
  { code: "D2331", desc: "Resin-based comp-2 surf, ant.", rvu: 4 },
  { code: "D2332", desc: "Resin-based comp-3 surf, ant.", rvu: 5 },
  { code: "D2335", desc: "Resin-based comp-4+surf, ant.", rvu: 5 },
  { code: "D2390", desc: "Resin-based comp crown, ant.", rvu: 5 },
  { code: "D2391", desc: "Resin-based comp-1 surf, post.", rvu: 3 },
  { code: "D2392", desc: "Resin-based comp-2 surf, post.", rvu: 4 },
  { code: "D2393", desc: "Resin-based comp-3 surf, post.", rvu: 5 },
  { code: "D2394", desc: "Resin-based comp-4+surf, post.", rvu: 5 },
  { code: "D2510A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2510B", desc: "Final Impression", rvu: 5 },
  { code: "D2510C", desc: "Cementation", rvu: 5 },
  { code: "D2520A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2520B", desc: "Final Impression", rvu: 5 },
  { code: "D2520C", desc: "Cementation", rvu: 5 },
  { code: "D2530A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2530B", desc: "Final Impression", rvu: 5 },
  { code: "D2530C", desc: "Cementation", rvu: 5 },
  { code: "D2542A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2542B", desc: "Final Impression", rvu: 5 },
  { code: "D2542C", desc: "Cementation", rvu: 5 },
  { code: "D2543A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2543B", desc: "Final Impression", rvu: 5 },
  { code: "D2543C", desc: "Cementation", rvu: 5 },
  { code: "D2544A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2544B", desc: "Final Impression", rvu: 5 },
  { code: "D2544C", desc: "Cementation", rvu: 5 },
  { code: "D2610A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2610B", desc: "Final Impression", rvu: 5 },
  { code: "D2610C", desc: "Cementation", rvu: 5 },
  { code: "D2620A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2620B", desc: "Final Impression", rvu: 5 },
  { code: "D2620C", desc: "Cementation", rvu: 5 },
  { code: "D2630A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2630B", desc: "Final Impression", rvu: 5 },
  { code: "D2630C", desc: "Cementation", rvu: 5 },
  { code: "D2642A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2642B", desc: "Final Impression", rvu: 5 },
  { code: "D2642C", desc: "Cementation", rvu: 5 },
  { code: "D2643A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2643B", desc: "Final Impression", rvu: 5 },
  { code: "D2643C", desc: "Cementation", rvu: 5 },
  { code: "D2644A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2644B", desc: "Final Impression", rvu: 5 },
  { code: "D2644C", desc: "Cementation", rvu: 5 },
  { code: "D2650A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2650B", desc: "Final Impression", rvu: 5 },
  { code: "D2650C", desc: "Cementation", rvu: 5 },
  { code: "D2651A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2651B", desc: "Final Impression", rvu: 5 },
  { code: "D2651C", desc: "Cementation", rvu: 5 },
  { code: "D2652A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2652B", desc: "Final Impression", rvu: 5 },
  { code: "D2652C", desc: "Cementation", rvu: 5 },
  { code: "D2662A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2662B", desc: "Final Impression", rvu: 5 },
  { code: "D2662C", desc: "Cementation", rvu: 5 },
  { code: "D2663A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2663B", desc: "Final Impression", rvu: 5 },
  { code: "D2663C", desc: "Cementation", rvu: 5 },
  { code: "D2664A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2664B", desc: "Final Impression", rvu: 5 },
  { code: "D2664C", desc: "Cementation", rvu: 5 },
  { code: "D2710A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2710B", desc: "Final Impression", rvu: 5 },
  { code: "D2710C", desc: "Cementation", rvu: 5 },
  { code: "D2740A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2740B", desc: "Final Impression", rvu: 5 },
  { code: "D2740C", desc: "Cementation", rvu: 5 },
  { code: "D2750A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2750B", desc: "Final Impression", rvu: 5 },
  { code: "D2750C", desc: "Cementation", rvu: 5 },
  { code: "D2752A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2752B", desc: "Final Impression", rvu: 5 },
  { code: "D2752C", desc: "Cementation", rvu: 5 },
  { code: "D2780A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2780B", desc: "Final Impression", rvu: 5 },
  { code: "D2780C", desc: "Cementation", rvu: 5 },
  { code: "D2781A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2781B", desc: "Final Impression", rvu: 5 },
  { code: "D2781C", desc: "Cementation", rvu: 5 },
  { code: "D2782A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2782B", desc: "Final Impression", rvu: 5 },
  { code: "D2782C", desc: "Cementation", rvu: 5 },
  { code: "D2783A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2783B", desc: "Final Impression", rvu: 5 },
  { code: "D2783C", desc: "Cementation", rvu: 5 },
  { code: "D2790A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2790B", desc: "Final Impression", rvu: 5 },
  { code: "D2790C", desc: "Cementation", rvu: 5 },
  { code: "D2791A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2791B", desc: "Final Impression", rvu: 5 },
  { code: "D2791C", desc: "Cementation", rvu: 5 },
  { code: "D2792A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2792B", desc: "Final Impression", rvu: 5 },
  { code: "D2792C", desc: "Cementation", rvu: 5 },
  { code: "D2799", desc: "Provisional crown", rvu: 5 },
  { code: "D2910", desc: "Re-cement or re-bond inlay, onlay, veneer or partial coverag", rvu: 2 },
  { code: "D2915", desc: "Re-cement or re-bond indirectly fabricated or prefabricated", rvu: 2 },
  { code: "D2920", desc: "Re-cement or re-bond crown", rvu: 2 },
  { code: "D2929", desc: "Prefabricated porc/cer crown-PrimaryTeeth-Zirconia", rvu: 5 },
  { code: "D2930", desc: "Prefab SS crown - prim. tooth", rvu: 5 },
  { code: "D2931", desc: "Prefab SS crown - perm. tooth", rvu: 5 },
  { code: "D2933", desc: "Prefab SS crown - resin window", rvu: 5 },
  { code: "D2940", desc: "Sedative filling", rvu: 3 },
  { code: "D2950", desc: "Core buildup - including pins", rvu: 5 },
  { code: "D2952A", desc: "Initial Preparation", rvu: 4 },
  { code: "D2952B", desc: "Final Impression", rvu: 4 },
  { code: "D2952C", desc: "Cementation", rvu: 4 },
  { code: "D2954", desc: "Prefab post & core, w/o crown", rvu: 7 },
  { code: "D2955", desc: "Post removal", rvu: 3 },
  { code: "D2960", desc: "Labial veneer, resin-chairside", rvu: 6 },
  { code: "D2962A", desc: "Initial Preparation", rvu: 5 },
  { code: "D2962B", desc: "Final Impression", rvu: 5 },
  { code: "D2962C", desc: "Cementation", rvu: 5 },
  { code: "D2970", desc: "Temporary crown, fractured tth", rvu: 3 },
  { code: "D2980", desc: "Crown repair", rvu: 2 },
  { code: "D2981", desc: "Inlay repair-material fail", rvu: 2 },
  { code: "D2982", desc: "Onlay repair-material fail", rvu: 2 },
  { code: "D2983", desc: "Veneer repair-material fail", rvu: 2 },
  { code: "D2990", desc: "Resin infil-incip smooth surf", rvu: 2 },
  { code: "D2999", desc: "Unspecified restorative proc.", rvu: 1 },
  { code: "DD2610A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2610B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2610C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2610D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2620A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2620B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2620C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2620D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2630A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2630B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2630C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2630D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2642A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2642B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2642C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2642D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2643A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2643B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2643C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2643D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2644A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2644B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2644C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2644D", desc: "Digital - Design", rvu: 3 },
  { code: "DD2740A", desc: "Digital - Initial preparation", rvu: 5 },
  { code: "DD2740B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD2740C", desc: "Digital - Delivery", rvu: 5 },
  { code: "DD2740D", desc: "Digital - Design", rvu: 3 },
  { code: "DDI299", desc: "Digital Scan Transition", rvu: 2 },
  { code: "D3000NC", desc: "In Process Step or PO Endodontic", rvu: 2 },
  { code: "D3110", desc: "Direct Pulp Cap", rvu: 0.5 },
  { code: "D3120", desc: "Indirect Pulp Cap", rvu: 0.5 },
  { code: "D3220", desc: "Therapeutic pulpotomy", rvu: 3 },
  { code: "D3220LS", desc: "Theraputic pulpotomy", rvu: 3 },
  { code: "D3310A", desc: "Access", rvu: 5 },
  { code: "D3310B", desc: "Fill", rvu: 7 },
  { code: "D3320A", desc: "Access", rvu: 5 },
  { code: "D3320B", desc: "Fill", rvu: 10 },
  { code: "D3330A", desc: "Access", rvu: 10 },
  { code: "D3330B", desc: "Fill", rvu: 10 },
  { code: "D3346A", desc: "Access", rvu: 8 },
  { code: "D3346B", desc: "Fill", rvu: 7 },
  { code: "D3347A", desc: "Access", rvu: 8 },
  { code: "D3347B", desc: "Fill", rvu: 7 },
  { code: "D3348A", desc: "Access", rvu: 10 },
  { code: "D3348B", desc: "Fill", rvu: 10 },
  { code: "D3351", desc: "Apex/recalc - initial visit", rvu: 2 },
  { code: "D3352", desc: "Apex/recalc-interim med replac", rvu: 1 },
  { code: "D3353", desc: "Apex/recalc - final visit", rvu: 1 },
  { code: "D3911", desc: "Intraorifice barrier", rvu: 3 },
  { code: "D3921", desc: "Decoronation or submergence of an erupted tooth", rvu: 3 },
  { code: "D4000NC", desc: "In Process Step or PO Periodontics", rvu: 2 },
  { code: "D4322", desc: "Splint - Intracoronal; Natural Teeth/Prosthetic Crowns", rvu: 3 },
  { code: "D4323", desc: "Splint - Extracoronal; Natural Teeth/Prosthetic Crowns", rvu: 3 },
  { code: "D4341", desc: "Sc/Rp 4 or more teeth/quad", rvu: 5 },
  { code: "D4341C", desc: "Sc/RP Competency", rvu: 5 },
  { code: "D4342", desc: "Sc/Rp 1-3 teeth/quad", rvu: 3 },
  { code: "D4346", desc: "Scaling w/ general, moderate or severe gingival inflammation", rvu: 5 },
  { code: "D4355", desc: "Full mouth debridement", rvu: 4 },
  { code: "D4381", desc: "Chemotherapy - per tooth", rvu: 1 },
  { code: "D4905", desc: "Surgical Assist", rvu: 2 },
  { code: "D4906", desc: "D2 PG Perio Rotation", rvu: 2 },
  { code: "D4910", desc: "Periodontal maintenance", rvu: 5 },
  { code: "D4910C", desc: "Perio Maintenance Competency", rvu: 4 },
  { code: "I4002", desc: "Perio Pro Health System", rvu: 2 },
  { code: "D5000FD", desc: "In Process Step of PO Removable - Full Denture", rvu: 2 },
  { code: "D5000PD", desc: "In Process Step or PO Removable - Partial Denture", rvu: 2 },
  { code: "D5110A", desc: "Final Impression", rvu: 10 },
  { code: "D5110B", desc: "Wax Tryin", rvu: 10 },
  { code: "D5110C", desc: "Delivery", rvu: 5 },
  { code: "D5110PA", desc: "Preliminary Impression", rvu: 5 },
  { code: "D5110PB", desc: "Border Molding/Final Impression", rvu: 5 },
  { code: "D5110PC", desc: "Wax-Rim Try-In / Interocclusal Records", rvu: 5 },
  { code: "D5110PD", desc: "Trial Denture Try-In", rvu: 5 },
  { code: "D5110PE", desc: "Delivery", rvu: 5 },
  { code: "D5120A", desc: "Final Impression", rvu: 10 },
  { code: "D5120B", desc: "Wax Tryin", rvu: 10 },
  { code: "D5120C", desc: "Delivery", rvu: 4 },
  { code: "D5120D", desc: "Consult for implant overdenture", rvu: 1 },
  { code: "D5120PA", desc: "Denture Prelim Impression", rvu: 5 },
  { code: "D5120PB", desc: "Denture Border Mold / Final Impression", rvu: 5 },
  { code: "D5120PC", desc: "Denture Wax-rim / Interocclusal Records", rvu: 5 },
  { code: "D5120PD", desc: "Trial Denture Try-In", rvu: 5 },
  { code: "D5120PE", desc: "Denture Delivery", rvu: 5 },
  { code: "D5130A", desc: "Final Impression", rvu: 10 },
  { code: "D5130B", desc: "Wax Tryin", rvu: 10 },
  { code: "D5130C", desc: "Delivery", rvu: 5 },
  { code: "D5140A", desc: "Final Impression", rvu: 10 },
  { code: "D5140B", desc: "Wax Tryin", rvu: 10 },
  { code: "D5140C", desc: "Delivery", rvu: 4 },
  { code: "D5140D", desc: "Consult for implant overdenture", rvu: 1 },
  { code: "D5211A", desc: "Final Impression", rvu: 4 },
  { code: "D5211B", desc: "Wax Tryin", rvu: 4 },
  { code: "D5211C", desc: "Delivery", rvu: 2 },
  { code: "D5212A", desc: "Final Impression", rvu: 4 },
  { code: "D5212B", desc: "Wax Tryin", rvu: 4 },
  { code: "D5212C", desc: "Delivery", rvu: 2 },
  { code: "D5213A", desc: "Final Impression", rvu: 7 },
  { code: "D5213B", desc: "Framework Tryin", rvu: 7 },
  { code: "D5213C", desc: "Wax tryin", rvu: 7 },
  { code: "D5213D", desc: "Delivery", rvu: 4 },
  { code: "D5214A", desc: "Final Impression", rvu: 7 },
  { code: "D5214B", desc: "Framework Tryin", rvu: 7 },
  { code: "D5214C", desc: "Wax tryin", rvu: 7 },
  { code: "D5214D", desc: "Delivery", rvu: 4 },
  { code: "D5410", desc: "Max. Complete Denture Adjust.", rvu: 1 },
  { code: "D5411", desc: "Mand. Complete Denture Adjust.", rvu: 1 },
  { code: "D5421", desc: "Max. Partial Adjustment", rvu: 1 },
  { code: "D5422", desc: "Mand. Partial Adjustment", rvu: 1 },
  { code: "D5455FD", desc: "Post Insertion Adjustment N/C - Full Denture", rvu: 1 },
  { code: "D5455PD", desc: "Post Insertion Adjustment N/C - Partial Denture", rvu: 1 },
  { code: "D5511", desc: "Repair denture base, Mandibular", rvu: 2 },
  { code: "D5512", desc: "Repair denture base, Maxillary", rvu: 2 },
  { code: "D5520", desc: "Replace teeth - per tooth", rvu: 5 },
  { code: "D5611", desc: "Repair resin partial denture base, Mandibular", rvu: 2 },
  { code: "D5612", desc: "Repair resin partial denture base, Maxillary", rvu: 2 },
  { code: "D5621", desc: "Repair cast partial framework, Mandibular", rvu: 5 },
  { code: "D5622", desc: "Repair cast partial framework, Maxillary", rvu: 5 },
  { code: "D5630", desc: "Repair or replace broken clasp", rvu: 5 },
  { code: "D5640", desc: "Replace teeth - per tooth", rvu: 5 },
  { code: "D5650", desc: "Add tooth to existing partial", rvu: 5 },
  { code: "D5660", desc: "Add clasp to existing partial", rvu: 5 },
  { code: "D5670", desc: "Replace all teeth - max", rvu: 10 },
  { code: "D5671", desc: "Replace all teeth - mand", rvu: 10 },
  { code: "D5710", desc: "Rebase complete max. denture", rvu: 8 },
  { code: "D5711", desc: "Rebase complete mand. denture", rvu: 8 },
  { code: "D5720", desc: "Rebase max. partial denture", rvu: 8 },
  { code: "D5721", desc: "Rebase mand. partial denture", rvu: 8 },
  { code: "D5730", desc: "Reline comp max - chairside", rvu: 5 },
  { code: "D5731", desc: "Reline comp mand - chairside", rvu: 5 },
  { code: "D5740", desc: "Reline max part - chairside", rvu: 5 },
  { code: "D5741", desc: "Reline mand part - chairside", rvu: 5 },
  { code: "D5750A", desc: "Final Impression", rvu: 4 },
  { code: "D5750C", desc: "Delivery", rvu: 4 },
  { code: "D5751A", desc: "Final Impression", rvu: 4 },
  { code: "D5751C", desc: "Delivery", rvu: 4 },
  { code: "D5760A", desc: "Final Impression", rvu: 4 },
  { code: "D5760C", desc: "Delivery", rvu: 4 },
  { code: "D5761A", desc: "Final Impression", rvu: 4 },
  { code: "D5761C", desc: "Delivery", rvu: 4 },
  { code: "D5810A", desc: "Final Impression", rvu: 5 },
  { code: "D5810B", desc: "Wax Tryin", rvu: 5 },
  { code: "D5810C", desc: "Delivery", rvu: 5 },
  { code: "D5811A", desc: "Final Impression", rvu: 5 },
  { code: "D5811B", desc: "Wax Tryin", rvu: 5 },
  { code: "D5811C", desc: "Delivery", rvu: 5 },
  { code: "D5820A", desc: "Final Impression", rvu: 4 },
  { code: "D5820B", desc: "Wax Tryin", rvu: 4 },
  { code: "D5820C", desc: "Delivery", rvu: 4 },
  { code: "D5820EA", desc: "Final Impression", rvu: 4 },
  { code: "D5820EB", desc: "Wax Tryin", rvu: 3 },
  { code: "D5820EC", desc: "Delivery", rvu: 3 },
  { code: "D5820SA", desc: "Final Impression", rvu: 5 },
  { code: "D5820SB", desc: "Wax Tryin", rvu: 5 },
  { code: "D5820SC", desc: "Delivery", rvu: 5 },
  { code: "D5821A", desc: "Final Impression", rvu: 4 },
  { code: "D5821B", desc: "Wax Tryin", rvu: 4 },
  { code: "D5821C", desc: "Delivery", rvu: 4 },
  { code: "D5821EA", desc: "Final Impression", rvu: 4 },
  { code: "D5821EB", desc: "Wax Tryin", rvu: 3 },
  { code: "D5821EC", desc: "Delivery", rvu: 3 },
  { code: "D5821SA", desc: "Final Impression", rvu: 5 },
  { code: "D5821SB", desc: "Wax Tryin", rvu: 5 },
  { code: "D5821SC", desc: "Delivery", rvu: 5 },
  { code: "D5850", desc: "Tissue conditioning - Max.", rvu: 5 },
  { code: "D5851", desc: "Tissue conditioning - Mand.", rvu: 5 },
  { code: "D5860A", desc: "Final Impression", rvu: 10 },
  { code: "D5860B", desc: "Wax Tryin", rvu: 10 },
  { code: "D5860C", desc: "Delivery", rvu: 5 },
  { code: "D5861A", desc: "Final Impression", rvu: 5 },
  { code: "D5861B", desc: "Wax Tryin", rvu: 5 },
  { code: "D5861C", desc: "Delivery", rvu: 5 },
  { code: "D5867", desc: "Replace, part of semi-prec att", rvu: 5 },
  { code: "D5875", desc: "Mod of rem prosth after implnt", rvu: 4 },
  { code: "D5876", desc: "Add metal substructure to acrylic full denture", rvu: 1 },
  { code: "D5899", desc: "Unspec removable prosth proc.", rvu: 5 },
  { code: "D5982", desc: "Surgical stent", rvu: 6 },
  { code: "D6000NC", desc: "In Process Step or PO FDP/Implants", rvu: 2 },
  { code: "D6010", desc: "Surg placement, endosteal impl", rvu: 10 },
  { code: "D6010PG", desc: "PG, Surg placement, endosteal impl", rvu: 10 },
  { code: "D6010U1", desc: "UG-OD(overdenture), Surg placement, endosteal impl", rvu: 10 },
  { code: "D6010U2", desc: "UG-STI(single tooth), Surg placement, endosteal impl", rvu: 10 },
  { code: "D6010Z", desc: "Zygoma Implant", rvu: 10 },
  { code: "D6011", desc: "Second stage implant surgery", rvu: 5 },
  { code: "D6051", desc: "Interim abutment", rvu: 5 },
  { code: "D6056", desc: "Prefabricated abutment", rvu: 2 },
  { code: "D6056U1", desc: "UG-OD(overdenture), Prefabricated abutment", rvu: 2 },
  { code: "D6057B", desc: "Final Impression", rvu: 5 },
  { code: "D6057C", desc: "Cementation", rvu: 5 },
  { code: "D6058A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6058B", desc: "Final Impression", rvu: 5 },
  { code: "D6058C", desc: "Cementation", rvu: 5 },
  { code: "D6059A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6059B", desc: "Final Impression", rvu: 5 },
  { code: "D6059C", desc: "Cementation", rvu: 5 },
  { code: "D6060A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6060B", desc: "Final Impression", rvu: 5 },
  { code: "D6060C", desc: "Cementation", rvu: 5 },
  { code: "D6061A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6061B", desc: "Final Impression", rvu: 5 },
  { code: "D6061C", desc: "Cementation", rvu: 5 },
  { code: "D6062A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6062B", desc: "Final Impression", rvu: 5 },
  { code: "D6062C", desc: "Cementation", rvu: 5 },
  { code: "D6063A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6063B", desc: "Final Impression", rvu: 5 },
  { code: "D6063C", desc: "Cementation", rvu: 5 },
  { code: "D6064A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6064B", desc: "Final Impression", rvu: 5 },
  { code: "D6064C", desc: "Cementation", rvu: 5 },
  { code: "D6065A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6065B", desc: "Final Impression", rvu: 5 },
  { code: "D6065C", desc: "Cementation", rvu: 5 },
  { code: "D6066A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6066B", desc: "Final Impression", rvu: 5 },
  { code: "D6066C", desc: "Cementation", rvu: 5 },
  { code: "D6067A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6067B", desc: "Final Impression", rvu: 5 },
  { code: "D6067C", desc: "Cementation", rvu: 5 },
  { code: "D6068A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6068B", desc: "Final Impression", rvu: 5 },
  { code: "D6068C", desc: "Cementation", rvu: 5 },
  { code: "D6069A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6069B", desc: "Final Impression", rvu: 5 },
  { code: "D6069C", desc: "Cementation", rvu: 5 },
  { code: "D6070A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6070B", desc: "Final Impression", rvu: 5 },
  { code: "D6070C", desc: "Cementation", rvu: 5 },
  { code: "D6071A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6071B", desc: "Final Impression", rvu: 5 },
  { code: "D6071C", desc: "Cementation", rvu: 5 },
  { code: "D6072A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6072B", desc: "Final Impression", rvu: 5 },
  { code: "D6072C", desc: "Cementation", rvu: 5 },
  { code: "D6073A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6073B", desc: "Final Impression", rvu: 5 },
  { code: "D6073C", desc: "Cementation", rvu: 5 },
  { code: "D6074A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6074B", desc: "Final Impression", rvu: 5 },
  { code: "D6074C", desc: "Cementation", rvu: 5 },
  { code: "D6075A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6075B", desc: "Final Impression", rvu: 5 },
  { code: "D6075C", desc: "Cementation", rvu: 5 },
  { code: "D6076A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6076B", desc: "Final Impression", rvu: 5 },
  { code: "D6076C", desc: "Cementation", rvu: 5 },
  { code: "D6077A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6077B", desc: "Final Impression", rvu: 5 },
  { code: "D6077C", desc: "Cementation", rvu: 5 },
  { code: "D6082A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6082B", desc: "Final Impression", rvu: 5 },
  { code: "D6082C", desc: "Cementation", rvu: 5 },
  { code: "D6083A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6083B", desc: "Final Impression", rvu: 5 },
  { code: "D6083C", desc: "Cementation", rvu: 5 },
  { code: "D6085", desc: "Provisional Implant Crown", rvu: 5 },
  { code: "D6086A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6086B", desc: "Final Impression", rvu: 5 },
  { code: "D6086C", desc: "Cementation", rvu: 5 },
  { code: "D6087A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6087B", desc: "Final Impression", rvu: 5 },
  { code: "D6087C", desc: "Cementation", rvu: 5 },
  { code: "D6092", desc: "Recement crown on abutment/implant", rvu: 2 },
  { code: "D6093", desc: "Recement FPD on abutment/implant", rvu: 2 },
  { code: "D6098A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6098B", desc: "Final Impression", rvu: 5 },
  { code: "D6098C", desc: "Cementation", rvu: 5 },
  { code: "D6099", desc: "Implant supported retainer for FPD-porc fusd-noble alloys", rvu: 5 },
  { code: "D6099B", desc: "Final Impression", rvu: 5 },
  { code: "D6099C", desc: "Cementation", rvu: 5 },
  { code: "D6114A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6114B", desc: "Final Impression", rvu: 5 },
  { code: "D6114C", desc: "Cementation", rvu: 5 },
  { code: "D6115A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6115B", desc: "Final Impression", rvu: 5 },
  { code: "D6115C", desc: "Cementation", rvu: 5 },
  { code: "D6116A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6116B", desc: "Final Impression", rvu: 5 },
  { code: "D6116C", desc: "Cementation", rvu: 5 },
  { code: "D6117A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6117B", desc: "Final Impression", rvu: 5 },
  { code: "D6117C", desc: "Cementation", rvu: 5 },
  { code: "D6190", desc: "Radiographic/surgical implant index", rvu: 3 },
  { code: "D6190BR", desc: "Surgical Guide-Bone Reduction Guide, Guided", rvu: 3 },
  { code: "D6190FG", desc: "Surgical Guide, Full Arch Guided", rvu: 3 },
  { code: "D6190IS", desc: "Surgical Guide-Single Tooth, Immediate Smile Model", rvu: 3 },
  { code: "D6190NF", desc: "Surgical Guide, Non-Guided Full Arch", rvu: 3 },
  { code: "D6190NS", desc: "Surgical Guide, Non-Guided Single Tooth", rvu: 3 },
  { code: "D6190SG", desc: "Surgical Guide-SingleTooth Guided", rvu: 3 },
  { code: "D6199", desc: "Unspecified implant proc.", rvu: 3 },
  { code: "D6210A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6210B", desc: "Final Impression", rvu: 1 },
  { code: "D6210C", desc: "Framework tryin", rvu: 1 },
  { code: "D6210D", desc: "Cementation", rvu: 1 },
  { code: "D6211A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6211B", desc: "Final Impression", rvu: 1 },
  { code: "D6211C", desc: "Cementation", rvu: 1 },
  { code: "D6212A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6212B", desc: "Final Impression", rvu: 1 },
  { code: "D6212C", desc: "Cementation", rvu: 1 },
  { code: "D6240A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6240B", desc: "Final Impression", rvu: 1 },
  { code: "D6240C", desc: "Cementation", rvu: 1 },
  { code: "D6241A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6241B", desc: "Final Impression", rvu: 1 },
  { code: "D6241C", desc: "Cementation", rvu: 1 },
  { code: "D6242A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6242B", desc: "Final Impression", rvu: 1 },
  { code: "D6242C", desc: "Framework tryin", rvu: 1 },
  { code: "D6242D", desc: "Cementation", rvu: 1 },
  { code: "D6245A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6245B", desc: "Final Impression", rvu: 1 },
  { code: "D6245C", desc: "Cementation", rvu: 1 },
  { code: "D6250A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6250B", desc: "Final Impression", rvu: 1 },
  { code: "D6250C", desc: "Cementation", rvu: 1 },
  { code: "D6251A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6251B", desc: "Final Impression", rvu: 1 },
  { code: "D6251C", desc: "Cementation", rvu: 1 },
  { code: "D6252A", desc: "Initial Preparation", rvu: 1 },
  { code: "D6252B", desc: "Final Impression", rvu: 1 },
  { code: "D6252C", desc: "Cementation", rvu: 1 },
  { code: "D6545A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6545B", desc: "Final Impression", rvu: 5 },
  { code: "D6545C", desc: "Cementation", rvu: 5 },
  { code: "D6548A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6548B", desc: "Final Impression", rvu: 5 },
  { code: "D6548C", desc: "Cementation", rvu: 5 },
  { code: "D6740A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6740B", desc: "Final Impression", rvu: 5 },
  { code: "D6740C", desc: "Cementation", rvu: 5 },
  { code: "D6750A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6750B", desc: "Final Impression", rvu: 5 },
  { code: "D6750C", desc: "Cementation", rvu: 5 },
  { code: "D6751A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6751B", desc: "Final Impression", rvu: 5 },
  { code: "D6751C", desc: "Cementation", rvu: 5 },
  { code: "D6752A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6752B", desc: "Final Impression", rvu: 5 },
  { code: "D6752C", desc: "Framework tryin", rvu: 4 },
  { code: "D6752D", desc: "Cementation", rvu: 4 },
  { code: "D6780A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6780B", desc: "Final Impression", rvu: 5 },
  { code: "D6780C", desc: "Cementation", rvu: 5 },
  { code: "D6781A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6781B", desc: "Final Impression", rvu: 5 },
  { code: "D6781C", desc: "Cementation", rvu: 5 },
  { code: "D6782A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6782B", desc: "Final Impression", rvu: 5 },
  { code: "D6782C", desc: "Cementation", rvu: 5 },
  { code: "D6783A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6783B", desc: "Final Impression", rvu: 5 },
  { code: "D6783C", desc: "Cementation", rvu: 5 },
  { code: "D6790A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6790B", desc: "Final Impression", rvu: 5 },
  { code: "D6790C", desc: "Framework tryin", rvu: 4 },
  { code: "D6790D", desc: "Cementation", rvu: 4 },
  { code: "D6791A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6791B", desc: "Final Impression", rvu: 5 },
  { code: "D6791C", desc: "Cementation", rvu: 5 },
  { code: "D6792A", desc: "Initial Preparation", rvu: 5 },
  { code: "D6792B", desc: "Final Impression", rvu: 5 },
  { code: "D6792C", desc: "Cementation", rvu: 5 },
  { code: "D6793", desc: "Provisional retainer crown", rvu: 2 },
  { code: "D6930", desc: "Recement FPD", rvu: 3 },
  { code: "D6975", desc: "Coping - metal", rvu: 8 },
  { code: "DD6057B", desc: "Digital- Scan and design", rvu: 5 },
  { code: "DD6057C", desc: "Digital- Delivery", rvu: 5 },
  { code: "DD6058A", desc: "Digital- Initial preparation", rvu: 5 },
  { code: "DD6058B", desc: "Digital- Scan and design", rvu: 5 },
  { code: "DD6058C", desc: "Digital- Delivery", rvu: 5 },
  { code: "DD6065A", desc: "Digital- Initial preparation", rvu: 5 },
  { code: "DD6065B", desc: "Digital- Scan and design", rvu: 5 },
  { code: "DD6065C", desc: "Digital- Delivery", rvu: 5 },
  { code: "DD6190", desc: "Digital - Radiographic/surgical implant index", rvu: 3 },
  { code: "DD6245A", desc: "Digital - Initial Preparation", rvu: 1 },
  { code: "DD6245B", desc: "Digital - Scan", rvu: 1 },
  { code: "DD6245C", desc: "Digital - Delivery", rvu: 3 },
  { code: "DD6245D", desc: "Digital - Design", rvu: 3 },
  { code: "DD6548B", desc: "Digital - Scan", rvu: 5 },
  { code: "DD6548C", desc: "Digital - Delivery", rvu: 3 },
  { code: "DD6548D", desc: "Digital - Design", rvu: 3 },
  { code: "D7000NC", desc: "In Process Step or PO Surgical", rvu: 2 },
  { code: "D7111", desc: "Coronal remnants - decid. tth", rvu: 4 },
  { code: "D7140", desc: "Extraction, eruptd tth/ exp rt", rvu: 4 },
  { code: "D7210", desc: "Surg removal of erupted tooth", rvu: 6 },
  { code: "D7220", desc: "Rem of impacted tth, soft tiss", rvu: 6 },
  { code: "D7230", desc: "Rem of impacted tth, part bony", rvu: 7 },
  { code: "D7240", desc: "Rem of impacted tth, comp bony", rvu: 8 },
  { code: "D7250", desc: "Removal of residual tth roots", rvu: 5 },
  { code: "D7270", desc: "Tooth reimplantation/stabilize", rvu: 5 },
  { code: "D7288", desc: "Brush Biopsy", rvu: 1 },
  { code: "D7310", desc: "Alveoloplasty with extractions, 4 or more per quad", rvu: 2 },
  { code: "D7311", desc: "Alveoloplasty with extractions, 1-3 tth per quad", rvu: 5 },
  { code: "D7320", desc: "Alveoloplasty w/o extractions, 4+ spaces per quad", rvu: 6 },
  { code: "D7321", desc: "Alveoloplasty w/o extractions, 1-3 spaces per quad", rvu: 5 },
  { code: "D7471", desc: "Removal of lateral exostosis", rvu: 5 },
  { code: "D7472", desc: "Removal of torus palatinus", rvu: 5 },
  { code: "D7473", desc: "Removal of torus mandibularis", rvu: 5 },
  { code: "D7510", desc: "Incision/drainage,abscess-intr", rvu: 3 },
  { code: "D7530", desc: "Removal of foreign body/skin", rvu: 3 },
  { code: "D7540", desc: "Removal-musculoskeletal system", rvu: 4 },
  { code: "D7910", desc: "Suture of recent small wounds", rvu: 3 },
  { code: "D7953", desc: "Extraction site preservation, graft per site", rvu: 3 },
  { code: "D7953UG", desc: "Extraction site preservation, graft per site", rvu: 3 },
  { code: "D7961", desc: "Buccal/labial frenectomy (frenulectomy)", rvu: 4 },
  { code: "D7962", desc: "Lingual frenectomy (frenulectomy)", rvu: 4 },
  { code: "D7971", desc: "Excision - pericoronal gingiva", rvu: 3 },
  { code: "D7972", desc: "Surg reduct, fibrs. tuberosity", rvu: 4 },
  { code: "D7994", desc: "Surgical Placement : Zygomatic Implant", rvu: 10 },
  { code: "D8010", desc: "Limited ortho - primary", rvu: 15 },
  { code: "D8020", desc: "Limited ortho - transitional", rvu: 15 },
  { code: "D8030", desc: "Limtd Adoles Fixed", rvu: 15 },
  { code: "D8090", desc: "Comprehensive Adult Fixed", rvu: 30 },
  { code: "D8099", desc: "Comprehen Adult Fixed Delta", rvu: 30 },
  { code: "D8210", desc: "Inter Removable Functional", rvu: 5 },
  { code: "D8660", desc: "Pre-ortho treatment visit", rvu: 3 },
  { code: "D8670", desc: "Periodic ortho treatment visit", rvu: 3 },
  { code: "D8703", desc: "Replacement of lost/broken retainer - Maxillary", rvu: 5 },
  { code: "D8704", desc: "Replacement of lost/broken retainer - Mandibular", rvu: 5 },
  { code: "D9090", desc: "OMFP Limited Problem Focused Exam", rvu: 4 },
  { code: "D9110", desc: "Palliative Tx of dental pain", rvu: 3 },
  { code: "D9110.1", desc: "Pulpectomy Palliative", rvu: 3 },
  { code: "D9110.2", desc: "Pericoronitis Palliative", rvu: 3 },
  { code: "D9120", desc: "Fixed partial denture section", rvu: 2 },
  { code: "D9230", desc: "Analg, anxiolysis, inhal of NO", rvu: 2 },
  { code: "D9310", desc: "Consultation", rvu: 1 },
  { code: "D9314", desc: "Pediatric Dentistry Consult (College)", rvu: 1 },
  { code: "D9320", desc: "OMDS Consultation", rvu: 1 },
  { code: "D9330", desc: "Endodontic Consultation", rvu: 1 },
  { code: "D9340", desc: "Periodontic Consultation / Screening", rvu: 1 },
  { code: "D9350", desc: "Prosthodontic Consultation", rvu: 1 },
  { code: "D9351", desc: "CAD-CAM Consultation", rvu: 2 },
  { code: "D9360", desc: "UG Implant Consultation - Overdenture", rvu: 1 },
  { code: "D9365", desc: "UG Implant Consultation - Single Tooth", rvu: 2 },
  { code: "D9370", desc: "Oral Surgery Consultation", rvu: 1 },
  { code: "D9380", desc: "Orthodontic Consultation", rvu: 1 },
  { code: "D9390A", desc: "Request", rvu: 2 },
  { code: "D9390B", desc: "Response", rvu: 2 },
  { code: "D9445", desc: "Office visit - follow up n/c", rvu: 1 },
  { code: "D9630.1", desc: "Other drugs/medicaments - PreviDent 5000", rvu: 1 },
  { code: "D9630.2", desc: "Other drugs/medicaments - chlorhexidine", rvu: 1 },
  { code: "D9630.4", desc: "Other drugs/medicaments - MI Paste", rvu: 1 },
  { code: "D9902", desc: "UG implant surg assist-OD", rvu: 4.5 },
  { code: "D9903", desc: "UG implant surg assist-STI", rvu: 4.5 },
  { code: "D9905.1", desc: "Assist-General- 3 hrs", rvu: 4.5 },
  { code: "D9905.2", desc: "Assist-General- 2 hrs", rvu: 2 },
  { code: "D9905.3", desc: "Assist-General- 1 hr", rvu: 1.5 },
  { code: "D9908", desc: "Assist-PG Endo", rvu: 2 },
  { code: "D9909", desc: "Assist-UG OS Surgery", rvu: 4.5 },
  { code: "D9910", desc: "Applicate desensitizing medica", rvu: 2 },
  { code: "D9920", desc: "Behavior management", rvu: 2 },
  { code: "D9932", desc: "Cleaning & inspection-removable complete denture-maxillary", rvu: 1 },
  { code: "D9933", desc: "Cleaning & inspection-removable complete denture-mandibula", rvu: 1 },
  { code: "D9934", desc: "Cleaning & inspection-removable partial denture-maxillary", rvu: 1 },
  { code: "D9935", desc: "Cleaning & inspection-removable partial denture-mandibular", rvu: 1 },
  { code: "D9940A", desc: "Impression", rvu: 5 },
  { code: "D9940B", desc: "Delivery", rvu: 4 },
  { code: "D9941", desc: "Fabrication of athl mouthguard", rvu: 5 },
  { code: "D9943", desc: "Occlusal guard adjustment", rvu: 1 },
  { code: "D9944A", desc: "Impression", rvu: 5 },
  { code: "D9944B", desc: "Delivery", rvu: 4 },
  { code: "D9945A", desc: "Impression", rvu: 5 },
  { code: "D9945B", desc: "Delivery", rvu: 4 },
  { code: "D9946A", desc: "Impression", rvu: 5 },
  { code: "D9946B", desc: "Delivery", rvu: 4 },
  { code: "D9950", desc: "Occlusion analysis-mountd case", rvu: 3 },
  { code: "D9951", desc: "Occlusal adjustment - limited", rvu: 2 },
  { code: "D9952", desc: "Occlusal adjustment - complete", rvu: 5 },
  { code: "D9970", desc: "Enamel microabrasion", rvu: 2 },
  { code: "D9971", desc: "Odontoplasty 1-2 teeth", rvu: 1 },
  { code: "D9972", desc: "Ext Bleach - per arch, in office", rvu: 5 },
  { code: "D9973", desc: "External Bleaching - per tooth", rvu: 3 },
  { code: "D9974", desc: "Internal Bleaching - per tooth", rvu: 7 },
  { code: "D9975", desc: "Ext Bleach - per arch, home", rvu: 3 },
  { code: "D9999", desc: "Unspecified adjunctive proc.", rvu: 2 },
  { code: "I9001", desc: "IPE - InterProfessional Education", rvu: 2 },
  { code: "I9002", desc: "Lab Quality Review", rvu: 4 },
  { code: "I9004", desc: "Opioid Risk Assessment & Documentation", rvu: 2 },
  { code: "I9005A", desc: "EBD Topic Approved", rvu: 1 },
  { code: "I9005B", desc: "EBD Topic Presented", rvu: 9 },
  { code: "I9008", desc: "Leader of the Team Rotation", rvu: 6 },
  { code: "I9010B", desc: "Clinical Evaluation Completed", rvu: 3 },
  { code: "I9011", desc: "Patient Education", rvu: 1 },
  { code: "I9110B", desc: "Clinical Consultation Completed", rvu: 3 },
  { code: "I9311.1", desc: "Penicillin Allergy Reeval Request", rvu: 2 },
  { code: "R5110A", desc: "Final Impression", rvu: 10 },
  { code: "R5110B", desc: "Wax Tryin", rvu: 10 },
  { code: "R5110C", desc: "Delivery", rvu: 5 },
  { code: "R5120A", desc: "Final Impression", rvu: 10 },
  { code: "R5120B", desc: "Wax Tryin", rvu: 10 },
  { code: "R5120C", desc: "Delivery", rvu: 4 },
  { code: "R5120D", desc: "Consult for implant overdenture", rvu: 1 },
  { code: "R9905", desc: "Research Chairside Assisting NC - Research", rvu: 10 },
  { code: "R9906", desc: "Research Patient Recruitment NC - Research", rvu: 2 },
  { code: "RD5110A", desc: "Final Impression - Digital", rvu: 3 },
  { code: "RD5110B", desc: "Wax Tryin - Digital", rvu: 3 },
  { code: "RD5110C", desc: "Delivery - Digital", rvu: 3 },
  { code: "RD5120A", desc: "Final Impression - Digital", rvu: 3 },
  { code: "RD5120B", desc: "Wax Tryin - Digital", rvu: 3 },
  { code: "RD5120C", desc: "Delivery - Digital", rvu: 3 },
];

/* ============================================================================
 * NOTE-BUILDER CONFIG
 * ==========================================================================*/
// Three-level hierarchy: Section → Group → Procedure.
// Sections are the Swade TOC headings. Groups break large sections into
// natural sub-categories (e.g. Restorative → Resin Composite → Class I).
// Single-procedure groups are allowed and rendered with no sub-dropdown.
// Procedure IDs are stable source-line numbers used to look up TEMPLATES.
const CATEGORIES = [
  { id: "exams", label: "Exams", groups: [
    { id: "exam-procs", label: "Procedures", procedures: [
      { id: "273",  label: "Screening" },
      { id: "1091", label: "POE (Periodic Oral Exam)" },
      { id: "374",  label: "Urgent Care" },
      { id: "448",  label: "Urgent Care — Wisdom Tooth" },
      { id: "573",  label: "Perio COE" },
      { id: "703",  label: "Restorative COE" },
      { id: "807",  label: "Treatment Plan Presentation" },
      { id: "871",  label: "Implant Consult" },
      { id: "loe",  label: "LOE" },
    ]},
  ]},
  { id: "perio", label: "Perio", groups: [
    { id: "perio-procs", label: "Procedures", procedures: [
      { id: "1196", label: "Prophy" },
      { id: "1272", label: "SRP (Scaling & Root Planing)" },
      { id: "1346", label: "Perio Re-Evaluation" },
      { id: "1425", label: "Perio Maintenance" },
    ]},
  ]},
  { id: "restorative", label: "Restorative", groups: [
    { id: "amalgam", label: "Amalgam", procedures: [
      { id: "1549", label: "Amalgam" },
    ]},
    { id: "composite", label: "Resin Composite", procedures: [
      { id: "1641", label: "Class I" },
      { id: "1745", label: "Class II" },
      { id: "1850", label: "Class III" },
      { id: "1950", label: "Class IV" },
      { id: "2046", label: "Class V" },
      { id: "2156", label: "Veneers" },
    ]},
    { id: "rmgi", label: "Glass Ionomer", procedures: [
      { id: "2243", label: "RMGI" },
    ]},
    { id: "preventive", label: "Preventive", procedures: [
      { id: "2308", label: "Sealants" },
    ]},
    { id: "occ-guard", label: "Occlusal Guard", procedures: [
      { id: "2353", label: "Records" },
      { id: "2428", label: "Delivery" },
    ]},
  ]},
  { id: "fixed", label: "Fixed", groups: [
    { id: "fixed-procs", label: "Procedures", procedures: [
      { id: "2742", label: "Core Buildup" },
      { id: "2821", label: "Crown Prep" },
      { id: "3002", label: "Provisional Crown" },
      { id: "3076", label: "Final Impression" },
      { id: "3204", label: "Crown Delivery" },
      { id: "3268", label: "Crown Removal" },
      { id: "3319", label: "Endo Access Fill" },
    ]},
  ]},
  { id: "dentures", label: "Dentures", groups: [
    { id: "f-f", label: "Complete Denture Sequence", procedures: [
      { id: "3704", label: "#1 — COE & Diagnostic Impressions" },
      { id: "3831", label: "#2 — Border Molding & Final Impression" },
      { id: "3954", label: "#3 — Wax Rims" },
      { id: "4055", label: "#4 — Anterior Try-In" },
      { id: "4169", label: "#5 — Posterior Try-In" },
      { id: "4257", label: "#6 — Delivery" },
      { id: "4374", label: "#7 — Adjustment" },
    ]},
    { id: "denture-other", label: "Maintenance", procedures: [
      { id: "4454", label: "Lab Reline" },
    ]},
  ]},
  { id: "implant", label: "Implant", groups: [
    { id: "implant-procs", label: "Procedures", procedures: [
      { id: "4574", label: "Implant-Level Impression" },
      { id: "4685", label: "Custom Abutment Try-In" },
      { id: "4812", label: "Crown Delivery" },
    ]},
  ]},
  { id: "digital", label: "Digital", groups: [
    { id: "digital-prep", label: "Prep & Scan", procedures: [
      { id: "5004", label: "Inlay" },
      { id: "5032", label: "Onlay" },
      { id: "5062", label: "Crown" },
    ]},
    { id: "digital-deliver", label: "Delivery", procedures: [
      { id: "5305", label: "Digital Delivery" },
    ]},
  ]},
  { id: "endo", label: "Endo", groups: [
    { id: "rct", label: "Root Canal", procedures: [
      { id: "5472", label: "RCT — 1 Visit" },
    ]},
  ]},
  { id: "peds", label: "Peds", groups: [
    { id: "peds-exam", label: "Exam & Recall", procedures: [
      { id: "5985", label: "Initial / Recall" },
    ]},
    { id: "peds-prevent", label: "Preventive", procedures: [
      { id: "6038", label: "Silver Diamine Fluoride (SDF)" },
      { id: "6095", label: "Sealants" },
      { id: "6173", label: "PRR (Preventive Resin Restoration)" },
    ]},
    { id: "peds-composite", label: "Resin Composite", procedures: [
      { id: "6284", label: "Class I" },
      { id: "6406", label: "Class II" },
      { id: "6529", label: "Class III" },
      { id: "6644", label: "Class IV" },
      { id: "6759", label: "Class V" },
    ]},
    { id: "peds-amalgam", label: "Amalgam", procedures: [
      { id: "6880", label: "Amalgam" },
    ]},
    { id: "peds-crown", label: "Crowns", procedures: [
      { id: "6991", label: "Stainless Steel Crown (SSC)" },
      { id: "7242", label: "Strip Crown" },
    ]},
    { id: "peds-pulp", label: "Pulp Therapy", procedures: [
      { id: "7139", label: "Pulpotomy" },
    ]},
    { id: "peds-space", label: "Space Maintenance", procedures: [
      { id: "7306", label: "Impression" },
      { id: "7399", label: "Delivery" },
    ]},
  ]},
];

// Flatten the hierarchy into a list of procedures with breadcrumb metadata —
// useful for everything that operates on a procedure (Note Builder, Prep List,
// jump handlers).
function getAllProcedures() {
  const out = [];
  for (const cat of CATEGORIES) {
    for (const grp of cat.groups) {
      for (const proc of grp.procedures) {
        out.push({
          id: proc.id,
          label: proc.label,
          categoryId: cat.id,
          categoryLabel: cat.label,
          groupId: grp.id,
          groupLabel: grp.label,
          breadcrumb: `${cat.label} → ${grp.label} → ${proc.label}`,
        });
      }
    }
  }
  return out;
}

const ALL_PROCEDURES = getAllProcedures();
const findProcedure = (id) => ALL_PROCEDURES.find(p => p.id === id);

// Flatten a category's groups into a single procedures list with each
// procedure tagged with its group label as a prefix where helpful. This
// preserves the simpler 2-dropdown picker used by Note Builder and Prep
// List while still giving users the group context they'd see in Browse.
function flattenCategory(cat) {
  const procs = [];
  for (const grp of cat.groups) {
    for (const p of grp.procedures) {
      // If a category has only one group OR the group label is generic
      // ("Procedures"), don't prefix it (would be noise).
      const showPrefix =
        cat.groups.length > 1 &&
        grp.procedures.length > 1 &&
        grp.label !== "Procedures";
      const label = showPrefix ? `${grp.label} — ${p.label}` : p.label;
      procs.push({ id: p.id, label, groupId: grp.id, groupLabel: grp.label });
    }
  }
  return { ...cat, procedures: procs };
}

// All categories with .procedures available (for NoteBuilder, PrepList).
const FLAT_CATEGORIES = CATEGORIES.map(flattenCategory);

// Default values for a single anesthetic injection. Multiple injections live
// in fields.injections (array of these). Most procedures need only one; the
// "+ Add another anesthetic" button appends a new one.
const DEFAULT_INJECTION = {
  needle: "30G 25mm",                       // "30G 25mm" | "27G 35mm"
  drug: "lidocaine 1:100k epi",             // dropdown
  carpules: "1",                            // "1/4" | "1/2" | "1" | "2" | "3"
  side: "right",                            // "right" | "left"
  techIAN: false,                           // IAN + long buccal block
  techBuccalInfil: false,                   // Buccal infiltration #X
  techGreaterPalatine: false,               // Greater palatine block
  techNasopalatine: false,                  // Nasopalatine block
  techMaxInfil: false,                      // Maxillary buccal infiltration
};

const DEFAULT_FIELDS = {
  age: "", gender: "", clinic: "", tooth: "", shade: "",
  medHistory: "", medications: "", allergies: "",
  bp: "", bg: "", temp: "",
  // Anesthetic — list of injections (default: one).
  injections: [{ ...DEFAULT_INJECTION }],
  // Liners / sealers — default OFF; revealed via collapsible section.
  vitrebond: false,
  consepsis: false,
  gluma: false,
  // Nitrous — default ON for peds procedures that use it (Swade's templates
  // include nitrous by default since it's standard for behavior management).
  // Unchecking strips the "Titrated to 40% nitrous oxide..." sentence.
  nitrous: true,
  // Exam findings (only used by COE / POE templates that have these stubs).
  // Keyed by the literal stub label as it appears in the template, e.g.
  // "soft tissue conditions" matches "- soft tissue conditions:" in the
  // template body. Empty values mean the stub renders blank as before.
  examFindings: {},
  // NV / next visit
  nv: "",
  // Names (signature line)
  names: "",
  // Crown / provisional procedure options.
  // crownIsNew: "New?" checkbox — inserts "new" before "provisional" in note.
  //   Defaults to true (new provisional is the standard).
  // cordPlaced: "Placed cord?" checkbox — when true, shows cord size selector.
  // cordSize: the selected cord size (replaces #0 in template).
  // crownType: PFM or all-ceramic dropdown (replaces "PFM" in template).
  crownIsNew: true,
  cordPlaced: false,
  cordSize: "0",
  crownType: "PFM",
  // cc: Chief complaint — typed text inserted into the CC: curly-quote placeholder.
  cc: "",
  // accepted: "Accepted?" checkbox — when false, strips the provisional acceptance
  //   sentence from the note. Applies to screening (273) and implant consult (871).
  accepted: true,
  // perioImproved: perio re-eval improvement status. "improved" or "not improved".
  //   Substitutes into "Patient's periodontal health has [status] — [detail]."
  perioImproved: "improved",
  // perioImprovementDetail: free-text explanation for the improvement note.
  perioImprovementDetail: "",
};

// Anesthetic options from the manual (Local Anesthesia section).
const ANESTHETIC_OPTIONS = [
  "lidocaine 1:100k epi",
  "lidocaine 1:50k epi",
  "septocaine 1:100k epi",
  "septocaine 1:200k epi",
  "mepivacaine 3% (no epi)",
  "bupivacaine 1:200k epi",
  "prilocaine 4% (no epi)",
];

/* ============================================================================
 * UTILITIES
 * ==========================================================================*/

// --- Note rendering: substitute user fields into a raw template ----------
function renderTemplate(raw, f) {
  if (!raw) return "";
  let t = raw;

  // -------- 0. Clean up PDF-extraction artifacts. --------
  // The source templates were extracted from a PDF, which left two
  // recurring artifacts:
  //   (a) Mid-sentence line wraps: long sentences wrapped to a new line at
  //       fixed column widths, e.g. "Explained college\n policies".
  //   (b) Single-space line indents: every line starts with one space,
  //       inherited from the PDF's left-margin indent. This makes paragraphs
  //       visibly start with " Took..." instead of "Took...".
  //
  // Cleanup pass:
  //   (a) Rejoin any \n that sits between content and a clear continuation
  //       token (lowercase letter, opening paren, ampersand). We never touch
  //       \n followed by a dash, em-dash, digit, capital letter, or bullet —
  //       those signal intentional structure.
  //   (b) Strip exactly one leading space from each line (preserve two-or-
  //       more space indentation for any sub-bullet hierarchy).
  t = t.replace(/(\S)[ \t]*\n[ \t]+([a-z(&])/g, "$1 $2");
  t = t.replace(/(^|\n) (?! )/g, "$1");

  // -------- 1. Strip the COVID-19 paragraph entirely. --------
  // The block runs from " COVID-19:" through the second screening line,
  // followed by a blank line. The pattern is consistent across all templates.
  // Replace with two newlines so the surrounding paragraphs stay separated by
  // a blank line. Step 11 collapses any 3+ runs back down to 2.
  t = t.replace(
    /\n\s*COVID-19:\s*\n[\s\S]*?approved for treatment today\.\s*\n/,
    "\n\n"
  );

  // -------- 2. Strip optional vitals lines unless filled in. --------
  // Temperature: drop " - temperature: ºF" line entirely if no value.
  if (!f.temp.trim()) {
    t = t.replace(/^[ \t]*-[ \t]*temperature:[ \t]*ºF[ \t]*\n/im, "");
  } else {
    t = t.replace(/^([ \t]*-[ \t]*temperature:)[ \t]*ºF[ \t]*$/im,
                  `$1 ${f.temp.trim()}ºF`);
  }
  // Blood glucose: drop " - blood glucose:" line entirely if no value.
  if (!f.bg.trim()) {
    t = t.replace(/^[ \t]*-[ \t]*blood glucose:[ \t]*\n/im, "");
  } else {
    t = t.replace(/^([ \t]*-[ \t]*blood glucose:)[ \t]*$/im,
                  `$1 ${f.bg.trim()}`);
  }

  // -------- 3. Age + gender. --------
  // Some templates (273, 807, 871) start with 2–3 artifact spaces before
  // "y/o". Collapse those to exactly one space when the field is unfilled,
  // or to nothing (age precedes y/o directly) when filled.
  t = t.replace(/^[ \t]+(y\/o\b)/, f.age.trim() ? `${f.age.trim()} $1` : ` $1`);
  // For "y/o" elsewhere in the note (e.g. "- y/o"), insert age if set.
  if (f.age.trim()) {
    t = t.replace(/(^|[^\d])(\s)y\/o\b/g, `$1$2${f.age.trim()} y/o`);
  }
  if (f.gender.trim() && f.gender.trim().toLowerCase() !== "female") {
    t = t.replace(/\bfemale\b/g, f.gender.trim());
  }

  // -------- 4. Clinic substitution. --------
  // Templates use "Vivaldi clinic" (Swade's 2021 default), "Chicago clinic"
  // (implant / STI procedures), and "UG clinic" / "UG Peds" (screening).
  // When the user picks a clinic, substitute it everywhere. When the user
  // leaves the dropdown empty:
  //   - "Vivaldi clinic" → "Gershwin clinic" (sensible default for most work)
  //   - "Chicago clinic" → left unchanged (only Chicago does STI/implant work)
  //   - "UG clinic" / "UG Peds" → "Gershwin clinic" / "Gershwin"
  const userClinic = f.clinic.trim();
  const namedClinics = ["Gershwin", "Vivaldi", "Brahms", "Bach", "Mozart", "Pediatrics"];
  if (userClinic) {
    const replacement = namedClinics.includes(userClinic) ? `${userClinic} clinic` : userClinic;
    t = t.replace(/\bVivaldi clinic\b/g, replacement);
    t = t.replace(/\bChicago clinic\b/g, replacement);
    t = t.replace(/\bUG clinic\b/g, replacement);
    t = t.replace(/\bUG Peds\b/g, replacement);
  } else {
    t = t.replace(/\bVivaldi clinic\b/g, "Gershwin clinic");
    t = t.replace(/\bUG clinic\b/g, "Gershwin clinic");
    t = t.replace(/\bUG Peds\b/g, "Gershwin");
    // "Chicago clinic" intentionally left as-is — only Chicago does this work.
  }

  // -------- 5. Tooth + surfaces (unified field). --------
  // The tooth field accepts a single string with optional surfaces and
  // multiple teeth, e.g.:
  //    "19"               → #19
  //    "19, 30"           → #19, #30
  //    "#19-MO"           → #19-MO
  //    "#19-MO, #24-L"    → #19-MO, #24-L
  //    "19-MOD, 30-O"     → #19-MOD, #30-O   (auto-prefixes #)
  //
  // Each tooth-surface pair is parsed independently and assembled back into
  // the canonical "#N-SURF" format for substitution into the template.
  if (f.tooth.trim()) {
    const refs = f.tooth.split(",").map(token => {
      const m = token.trim().match(/^#?([A-Za-z0-9]+)(?:-([A-Za-z]+))?$/);
      if (!m) return null;
      const num = m[1];
      const surf = (m[2] || "").toUpperCase();
      return surf ? `#${num}-${surf}` : `#${num}`;
    }).filter(Boolean);

    if (refs.length > 0) {
      const joinedNew = refs.join(", ");
      // Find the FIRST tooth reference in the template (always present).
      const firstMatch = t.match(/#[A-Z0-9]+(-[A-Z]+)?/);
      if (firstMatch) {
        const oldRef = firstMatch[0];          // e.g. "#19-MOD"
        const oldBase = oldRef.split("-")[0];  // e.g. "#19"

        // Step 1: Replace the long form (with surfaces) with the joined list.
        // This handles the procedure heading.
        if (oldRef !== oldBase) {
          t = t.split(oldRef).join(joinedNew);
        }

        // Step 2: Replace remaining bare tooth refs (e.g. anesthetic line
        // "buccal infiltration #19.") with the FIRST tooth's bare ref —
        // anesthetic typically mentions just one tooth even in multi-tooth
        // procedures. Strip surfaces off refs[0] for the bare replacement.
        const firstBare = refs[0].split("-")[0];
        const escaped = oldBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const baseRegex = new RegExp(escaped + "(?![-A-Za-z0-9])", "g");
        t = t.replace(baseRegex, firstBare);
      }
    }
  }

  // -------- 6. Shade. --------
  if (f.shade.trim() && f.shade.trim().toUpperCase() !== "A2") {
    t = t.replace(/\bA2\b/g, f.shade.trim().toUpperCase());
  }

  // -------- 6b. Crown type (core buildup, crown prep). --------
  // When the user selects All-Ceramic, replace every "PFM" occurrence.
  if (f.crownType && f.crownType !== "PFM") {
    t = t.replace(/\bPFM\b/g, f.crownType);
  }

  // -------- 6c. "New?" provisional toggle (crown prep, provisional crown). --------
  // Templates have "new provisional" by default. When the checkbox is
  // unchecked, strip "new " before any "provisional" occurrence.
  if (f.crownIsNew === false) {
    t = t.replace(/\bnew provisional\b/g, "provisional");
  }

  // -------- 6d. Cord size (crown prep, provisional crown). --------
  // When the "Placed cord?" checkbox is checked and a size other than "0"
  // is selected, replace "#0" in the standard cord sentence.
  if (f.cordPlaced && f.cordSize) {
    t = t.replace(
      /Placed #0 gingival retraction cord soaked in Hemodent/g,
      `Placed #${f.cordSize} gingival retraction cord soaked in Hemodent`
    );
  }

  // -------- 6e. CC (chief complaint). --------
  // Templates use a curly-quote placeholder: CC: "“ ”" or CC: "“.”".
  // When the user types a CC, replace whatever sits between the curly quotes.
  if (f.cc && f.cc.trim()) {
    t = t.replace(
      /((?:CC:|Chief complaint:)\s*)“[^”]*”/g,
      (_, prefix) => `${prefix}“${f.cc.trim()}”`
    );
  }

  // -------- 6f. "Accepted?" toggle (screening, implant consult). --------
  // When unchecked, strips the provisional acceptance sentence.
  // Covers both forms: "accepted for UG STI placement" (871) and
  // "accepted to [clinic]" (273).
  if (f.accepted === false) {
    t = t.replace(/\s*Patient is provisionally accepted for[^.]+\.\s*/g, " ");
    t = t.replace(/\s*Patient is provisionally accepted to[^.]+\.\s*/g, " ");
    t = t.replace(/\n{3,}/g, "\n\n");
  }

  // -------- 6g. Perio re-eval improvement status + detail. --------
  // Applies to template 1346 (Perio Re-Evaluation). Replaces
  // "has improved — ." with "has [status] — [detail]."
  // Runs whenever either field is present in f (including defaults).
  if (f.perioImproved !== undefined || f.perioImprovementDetail !== undefined) {
    const status = (f.perioImproved || "improved");
    const detail = (f.perioImprovementDetail || "").trim();
    t = t.replace(
      /has improved — \./,
      `has ${status} — ${detail ? detail + "." : "."}`
    );
  }

  // -------- 7. Medical history / meds / allergies / BP. --------
  if (f.medHistory.trim()) {
    t = t.replace(/^([ \t]*-[ \t]*medical history:)[^\n]*/im,
                  `$1 ${f.medHistory.trim()}`);
  }
  if (f.medications.trim()) {
    t = t.replace(/^([ \t]*-[ \t]*medications:)[^\n]*/im,
                  `$1 ${f.medications.trim()}`);
  }
  if (f.allergies.trim()) {
    t = t.replace(/^([ \t]*-[ \t]*allergies:)[^\n]*/im,
                  `$1 ${f.allergies.trim()}`);
  }
  if (f.bp.trim()) {
    t = t.replace(/^([ \t]*-[ \t]*blood pressure:)[ \t]*$/im,
                  `$1 ${f.bp.trim()}`);
  }

  // -------- 7b. Exam findings (COE / POE structured fields). --------
  // For each entry in f.examFindings whose value is non-empty, find the
  // corresponding "- <label>:" line in the template and overwrite whatever
  // value sits after the colon. The regex is permissive ([^\n]* not [ \t]*)
  // so it works on both empty stubs and pre-filled lines (e.g. the EOE/TMJ/
  // IOE lines that ship with WNL defaults — students editing those in the
  // Disclosure should see their value replace the default).
  // Multi-line values get newlines inserted with proper indentation so the
  // template structure is preserved.
  // Two label keys are special:
  //   - "caries risk": writes "{value} (see caries risk form)" to match the
  //     existing convention students used to see hardcoded.
  //   - "odontogram":  doesn't map to a "- label:" stub; it replaces the bullet
  //     under the "Updated odontogram with radiographic & clinical hard tissue
  //     findings:" heading with the user's bulleted list.
  if (f.examFindings && typeof f.examFindings === "object") {
    for (const [label, value] of Object.entries(f.examFindings)) {
      if (typeof value === "boolean") continue; // ohi-checkbox booleans handled in 7b-perio
      const v = (value || "").trim();
      if (!v) continue;

      // Special-case: odontogram findings — write to the heading, not a stub.
      if (label === "odontogram") {
        // Ensure the user's content starts with a dash so the first line is
        // a proper bullet. Subsequent lines inherit dashes from auto-dash.
        const odon = v.startsWith("-") ? v : `- ${v}`;
        t = t.replace(
          /(Updated odontogram with radiographic & clinical hard tissue findings:)\n[ \t]*-[ \t]*(?=\n|$)/,
          (_m, heading) => `${heading}\n${odon}`
        );
        continue;
      }

      // Special-case: caries risk — append the standard reference suffix.
      const display = label === "caries risk"
        ? `${v} (see caries risk form)`
        : v;

      // Build a regex that matches the stub line (case-insensitive on label).
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(
        `^([ \\t]*-[ \\t]*${escaped}:)[^\\n]*$`,
        "im"
      );
      // For multi-line values, format as: stub: line 1\n  line 2\n  line 3
      const lines = display.split("\n");
      const replacement = lines.length === 1
        ? `$1 ${lines[0]}`
        : `$1 ${lines[0]}\n   ${lines.slice(1).join("\n   ")}`;
      t = t.replace(re, replacement);
    }
  }

  // -------- 7b-perio. Perio-specific field substitutions. --------
  // Applies only when examFindings contains perio keys — these replacements
  // are safe to run on any template since the patterns are perio-specific.
  {
    const ef = f.examFindings || {};

    // Gingival characteristics: replace [color], [contour], [consistency]
    // Only runs if the gingiva-dropdowns were used (keys present).
    const gingivaColor = (ef["gingival color"] || "").trim();
    const gingivaContour = (ef["gingival contour"] || "").trim();
    const gingivaConsistency = (ef["gingival consistency"] || "").trim();
    // Always substitute if any are set; fall back to stored values or defaults
    if (gingivaColor || gingivaContour || gingivaConsistency) {
      const c = gingivaColor || "pink";
      const co = gingivaContour || "scalloped";
      const cn = gingivaConsistency || "firm";
      t = t.replace(/\[color\], \[contour\], \[consistency\]/g, `${c}, ${co}, ${cn}`);
    }

    // Brushing & flossing frequency substitution
    const formatBrush = (v) => {
      if (v === "1x") return "1x per day";
      if (v === "3x") return "3x per day";
      return "2x per day"; // default
    };
    const formatFloss = (v) => {
      if (v === "2x/week") return "2x per week";
      if (v === "3-4x/week") return "3-4x per week";
      if (v === "1x/day") return "1x per day";
      return "1x per week"; // default
    };
    const brushFreq = ef["brushing frequency"];
    const flossFreq = ef["flossing frequency"];
    if (brushFreq) t = t.replace(/brushing \d+x per day/, `brushing ${formatBrush(brushFreq)}`);
    if (flossFreq) t = t.replace(/flossing [\dx-]+ per \w+/, `flossing ${formatFloss(flossFreq)}`);

    // Heavy plaque area
    const plaqueArea = (ef["plaque area"] || "").trim();
    if (plaqueArea) {
      t = t.replace(/heavy plaque on \./, `heavy plaque on ${plaqueArea}.`);
    }

    // Mucogingival defects: substitute WNL if the stub is still empty
    // (The form pre-fills it, but if somehow it's empty, keep the note clean.)
    if (!ef["mucogingival defects"]?.trim()) {
      t = t.replace(
        /^([ \t]*-[ \t]*mucogingival defects:)[ \t]*$/im,
        `$1 WNL`
      );
    }

    // OHI: conditional nutritional counseling / tobacco cessation
    // Templates now read "Reviewed OHI with demonstration." — we insert
    // "& completed ..." if one or both checkboxes are checked.
    const nutriCounsel = ef["nutritional counseling"] === true;
    const tobaccoCess = ef["tobacco cessation"] === true;
    if (nutriCounsel && tobaccoCess) {
      t = t.replace(
        /Reviewed OHI with demonstration\./,
        "Reviewed OHI with demonstration & completed nutritional counseling and tobacco cessation."
      );
    } else if (nutriCounsel) {
      t = t.replace(
        /Reviewed OHI with demonstration\./,
        "Reviewed OHI with demonstration & completed nutritional counseling."
      );
    } else if (tobaccoCess) {
      t = t.replace(
        /Reviewed OHI with demonstration\./,
        "Reviewed OHI with demonstration & completed tobacco cessation."
      );
    }
  }

  // -------- 7c. Nitrous (peds). --------
  // If the user unchecked "Nitrous", strip the "Titrated to 40% nitrous
  // oxide..." sentence + the "Administered for X minutes." follow-on.
  // Both sentences sit on the same line in Swade's templates so we match
  // them as a unit, including any trailing whitespace.
  if (f.nitrous === false) {
    t = t.replace(
      /Titrated to [^.]*nitrous[^.]*\.\s*Administered for [^.]*\.\s*/i,
      ""
    );
  }

  // -------- 8. Anesthetic substitution. --------
  // Templates contain a sentence like:
  //   "Applied 20% topical benzocaine & administered 1 carpule of 2% lidocaine
  //    1:100k epi with [ 30G 25mm / 27G 35 mm ] needle as IAN & long buccal
  //    block on right / buccal infiltration #19."
  // We rebuild it from the structured `injections` list. When there are
  // multiple injections, the first follows the standard "Applied 20% topical
  // benzocaine & administered ..." form, and subsequent ones are appended as
  // "Then administered ..." sentences (topical only applied once at the start).
  const anesSentenceRe =
    /Applied 20% topical benzocaine & administered [^.]*?\[\s*30G 25mm\s*\/\s*27G 35 mm\s*\][^.]*?\./;

  // Helper: build the trailing portion of one injection sentence.
  // Returns "X carpules of 2% drug with NEEDLE needle as TECHNIQUES."
  const buildInjectionTail = (inj) => {
    const drug = inj.drug || "lidocaine 1:100k epi";
    const drugPhrase = drug.match(/\d+%/) ? drug : `2% ${drug}`;
    const carp = inj.carpules || "1";
    const carpWord = carp === "1" ? "1 carpule" :
                     carp === "1/2" ? "½ carpule" :
                     carp === "1/4" ? "¼ carpule" :
                     `${carp} carpules`;
    const needle = inj.needle === "27G 35mm" ? "27G 35mm" : "30G 25mm";
    const side = inj.side === "left" ? "left" : "right";

    const techParts = [];
    if (inj.techIAN) techParts.push(`IAN & long buccal block on ${side}`);
    if (inj.techGreaterPalatine) techParts.push(`greater palatine block on ${side === "left" ? "L" : "R"}`);
    if (inj.techNasopalatine) techParts.push("nasopalatine block");
    if (inj.techMaxInfil) techParts.push(`maxillary buccal infiltration on ${side}`);
    if (inj.techBuccalInfil) {
      // Extract just the tooth number from the first token (strip leading
      // # and any "-MO"-style surface suffix).
      const firstTooth = f.tooth.split(",")[0].trim()
        .replace(/^#/, "").split("-")[0];
      const toothRef = firstTooth ? `#${firstTooth}` : "#";
      techParts.push(`buccal infiltration ${toothRef}`);
    }
    const techPhrase = techParts.length > 0 ? ` as ${techParts.join(" / ")}` : "";

    return `${carpWord} of ${drugPhrase} with ${needle} needle${techPhrase}.`;
  };

  const injections = Array.isArray(f.injections) && f.injections.length > 0
    ? f.injections
    : [DEFAULT_INJECTION];

  // First injection includes the topical benzocaine prefix; subsequent
  // injections are joined with " Then administered ".
  const sentences = injections.map((inj, i) => {
    const tail = buildInjectionTail(inj);
    return i === 0
      ? `Applied 20% topical benzocaine & administered ${tail}`
      : `Then administered ${tail}`;
  });
  const newAnes = sentences.join(" ");

  if (anesSentenceRe.test(t)) {
    t = t.replace(anesSentenceRe, newAnes);
  }

  // -------- 9. Liner / sealer toggles. --------
  // Each toggle, when OFF, removes the corresponding sentence. The PDF source
  // wraps long sentences across multiple lines, so we use \s+ (matches any
  // whitespace including newlines) instead of literal spaces between words.
  if (!f.vitrebond) {
    // "Applied 0.5 mm Vitrebond in deepest area of prep, light cured 20s."
    t = t.replace(
      /Applied\s+0\.5\s*mm\s+Vitrebond\s+in\s+deepest\s+area\s+of\s+prep,\s+light\s+cured\s+20s\.\s*/g,
      ""
    );
    // Endo access fill variant.
    t = t.replace(
      /Applied\s+0\.5\s*mm\s+layer\s+of\s+Vitrebond\s+to\s+cover\s+gutta\s+percha,\s+light\s+cured\s+\d+s\s+on\s+high\.\s*/g,
      ""
    );
  }
  if (!f.consepsis) {
    t = t.replace(
      /Scrubbed\s+with\s+Consepsis\s+10s\s+to\s+disinfect,\s+rinsed\s+5s,\s+gently\s+dried\.\s*/g,
      ""
    );
    t = t.replace(
      /Applied\s+Consepsis\s+in\s+scrubbing\s+motion\s+for\s+10s\s+for\s+disinfection,\s+then\s+rinsed\.\s*/g,
      ""
    );
  }
  if (!f.gluma) {
    t = t.replace(
      /Applied\s+Gluma\s+45s\s+to\s+desensitize,\s+air\s+dried,\s+rinsed\s+5s,\s+gently\s+dried\s+leaving\s+dentin\s+moist\.\s*/g,
      ""
    );
    t = t.replace(
      /Applied\s+Gluma\s+in\s+scrubbing\s+motion\s+for\s+10s\s+then\s+rinsed\s+thoroughly\.\s*/g,
      ""
    );
  }

  // -------- 10. NV (next visit). --------
  if (f.nv.trim()) {
    t = t.replace(/(^|\n)([ \t]*-?[ \t]*NV:)(.*)$/m,
                  (_m, pre, nv) => `${pre}${nv} ${f.nv.trim()}`);
  }

  // -------- 11. Names (signature line). --------
  if (f.names.trim()) {
    t = t.replace(/(^|\n)([ \t]*-?[ \t]*NV:.*)$/m,
                  (_m, pre, nv) => `${_m}\n ${f.names.trim()}`);
  }

  // -------- 12. Tidy: collapse 3+ consecutive newlines down to 2. --------
  t = t.replace(/\n{3,}/g, "\n\n");

  return t;
}

// --- Tokenizer + retrieval scoring ----------------------------------------
const STOPWORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being","do","does","did",
  "of","in","on","for","to","with","by","at","from","as","that","this","these",
  "those","it","its","i","me","my","you","your","we","our","and","or","but",
  "if","then","than","so","what","how","when","where","why","which","who",
  "can","could","should","would","will","just","not","no","yes","about",
]);

function tokenize(text) {
  if (!text) return [];
  const matches = text.toLowerCase().match(/[a-z0-9#]+/g) || [];
  return matches.filter(t => t.length > 1 && !STOPWORDS.has(t));
}

/* ============================================================================
 * SHARED STYLE TOKENS (CSS custom properties applied at <App> root)
 * ==========================================================================*/
const ROOT_TOKENS = {
  "--bg":         "#EFE9DC",
  "--paper":      "#FAF6ED",
  "--paper-soft": "#F4EEE1",
  "--card":       "#FCF9F2",   // slightly lighter than paper, for layered cards
  "--ink":        "#1A1612",
  "--ink-soft":   "#6A6055",
  "--ink-faint":  "#A89E90",
  "--rule":       "#D8CEBA",
  "--rule-soft":  "#E6DEC8",
  "--accent":     "#7A1E1E",   // oxblood (primary)
  "--accent-soft":"#A84949",
  "--gold":       "#9A7B3F",   // warm gold (secondary accent — counts, badges, segments)
  "--teal":       "#2C5F5D",   // deep teal (tertiary — used for tooth-segment color #2)
  "--mono-bg":    "#1E1A16",
  "--mono-fg":    "#EADFC8",
  "--mono-accent":"#D4A574",
};

/* ============================================================================
 * SMALL PRESENTATIONAL HELPERS
 * ==========================================================================*/
const labelStyle = {
  fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase",
  color: "var(--ink-soft)", fontWeight: 500, marginBottom: "3px",
  display: "block", fontFamily: "'Geist', sans-serif",
};
const inputStyle = {
  width: "100%", padding: "7px 10px", fontSize: "13px",
  fontFamily: "'Geist', sans-serif", color: "var(--ink)",
  background: "var(--paper)", border: "1px solid var(--rule)",
  borderRadius: "2px", outline: "none",
  transition: "border-color 140ms ease, box-shadow 140ms ease",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "9px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type="text" value={value} placeholder={placeholder || ""}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle,
        borderColor: focused ? "var(--accent)" : "var(--rule)",
        boxShadow: focused ? "0 0 0 3px rgba(122, 26, 26, 0.08)" : "none",
      }} />
  );
}

// Per-segment colors for multi-tooth input. Position 1 = accent (oxblood),
// position 2 = teal, position 3+ = gold. The Tooth field and Surfaces field
// share the same palette by index so the user can see at a glance which
// surface belongs to which tooth. These tie into the site palette tokens
// rather than being arbitrary RGBs, so any future palette tweak propagates.
const SEGMENT_COLORS = ["var(--ink)", "var(--accent)", "var(--teal)", "var(--gold)"];
//                      ^single        ^position 1     ^position 2    ^position 3+

// Render the value with each comma-separated segment colored. Used inside
// ToothInput as an absolutely-positioned mirror behind an invisible <input>.
function ColorizedMirror({ value }) {
  if (!value) return null;
  // Split on comma but KEEP the commas so the mirror is a perfect width match.
  // We'll style segments and commas independently.
  const parts = value.split(/(,)/);
  // parts looks like: ["19", ",", " 30", ",", " 31"] etc.
  // Count non-comma parts to decide if we should colorize at all.
  const segmentParts = parts.filter(p => p !== ",");
  const colorize = segmentParts.length > 1;
  let segIdx = 0;
  return (
    <>{parts.map((p, i) => {
      if (p === ",") {
        return <span key={i} style={{ color: "var(--ink-soft)" }}>,</span>;
      }
      // Color: position 1 → SEGMENT_COLORS[1], position 2 → [2], etc.
      // When only 1 segment exists, use index 0 (default ink).
      const color = colorize
        ? (SEGMENT_COLORS[Math.min(segIdx + 1, SEGMENT_COLORS.length - 1)])
        : SEGMENT_COLORS[0];
      segIdx += 1;
      return <span key={i} style={{ color }}>{p}</span>;
    })}</>
  );
}

function ToothInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  // The mirror sits behind a transparent <input>. For the caret to align
  // exactly with the visible (mirrored) text, the inner box geometry must
  // match the input's exactly:
  //   - same padding
  //   - same font-size / family / weight
  //   - the mirror is inset by 1px on all sides to sit inside the input's
  //     1px border
  //   - line-height set to 1 (matching what <input> uses by default for
  //     single-line layout) so vertical position is deterministic
  const inner = {
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "'Geist', sans-serif",
    fontWeight: 400,
    lineHeight: 1.5,
  };
  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden style={{
        position: "absolute",
        top: "1px", left: "1px", right: "1px", bottom: "1px",
        ...inner,
        pointerEvents: "none", whiteSpace: "pre",
        overflow: "hidden", textOverflow: "clip",
        boxSizing: "border-box",
      }}>
        <ColorizedMirror value={value} />
      </div>
      <input type="text" value={value} placeholder={placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle,
          ...inner,
          color: "transparent",
          caretColor: "var(--ink)",
          background: "transparent",
          position: "relative",
          textAlign: "center",
          borderColor: focused ? "var(--accent)" : "var(--rule)",
          boxShadow: focused ? "0 0 0 3px rgba(122, 26, 26, 0.08)" : "none",
        }} />
    </div>
  );
}

function Select({ value, onChange, children, prominent = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none",
          paddingRight: "34px", fontSize: prominent ? "15px" : "14px",
          fontWeight: prominent ? 500 : 400,
          borderColor: focused ? "var(--accent)" : "var(--rule)",
          boxShadow: focused ? "0 0 0 3px rgba(122, 26, 26, 0.08)" : "none",
          cursor: "pointer",
        }}>{children}</select>
      <span aria-hidden style={{
        position: "absolute", right: "12px", top: "50%",
        transform: "translateY(-50%)", fontSize: "10px",
        color: "var(--ink-soft)", pointerEvents: "none",
      }}>▼</span>
    </div>
  );
}

// Age input — clamps to 0-89 inclusive (HIPAA Safe Harbor: ages 90+ are
// considered identifiers in their own right, so we hard-stop at 89).
function AgeInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const handleChange = (raw) => {
    // strip non-digits, then clamp
    const digits = raw.replace(/\D/g, "");
    if (!digits) { onChange(""); return; }
    const n = Math.min(89, Math.max(0, parseInt(digits, 10)));
    onChange(String(n));
  };
  return (
    <input type="text" inputMode="numeric" value={value} placeholder="e.g. 42"
      onChange={(e) => handleChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle,
        borderColor: focused ? "var(--accent)" : "var(--rule)",
        boxShadow: focused ? "0 0 0 3px rgba(122, 26, 26, 0.08)" : "none",
      }} />
  );
}

// Two-state radio toggle (used for needle gauge).
function RadioToggle({ value, onChange, options }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: "0", border: "1px solid var(--rule)", borderRadius: "2px",
      overflow: "hidden", background: "var(--paper)",
    }}>
      {options.map((opt, i) => {
        const active = opt === value;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            style={{
              padding: "9px 6px", fontSize: "12px", border: "none",
              borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--paper)" : "var(--ink-soft)",
              fontWeight: active ? 500 : 400,
              fontFamily: "'Geist', sans-serif", cursor: "pointer",
              transition: "background 120ms ease, color 120ms ease",
            }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Checkbox row with label + small hint.
function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "8px 10px", borderRadius: "2px", cursor: "pointer",
      transition: "background 120ms ease",
      background: checked ? "rgba(122, 26, 26, 0.04)" : "transparent",
    }}
    onMouseEnter={(e) => {
      if (!checked) e.currentTarget.style.background = "var(--paper-soft)";
    }}
    onMouseLeave={(e) => {
      if (!checked) e.currentTarget.style.background = "transparent";
    }}>
      <span aria-hidden style={{
        width: "16px", height: "16px", flexShrink: 0,
        border: `1.5px solid ${checked ? "var(--accent)" : "var(--rule)"}`,
        background: checked ? "var(--accent)" : "transparent",
        borderRadius: "2px", marginTop: "2px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--paper)", fontSize: "11px",
        transition: "background 120ms ease, border-color 120ms ease",
      }}>{checked ? "✓" : ""}</span>
      <input type="checkbox" checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <div style={{ lineHeight: 1.4 }}>
        <div style={{
          fontSize: "13px",
          color: checked ? "var(--ink)" : "var(--ink-soft)",
          fontWeight: checked ? 500 : 400,
        }}>{label}</div>
        {hint && (
          <div style={{ fontSize: "11px", color: "var(--ink-faint)", marginTop: "1px" }}>
            {hint}
          </div>
        )}
      </div>
    </label>
  );
}

// Small section label inside a card (between Hairlines).
function SubsectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
      color: "var(--accent)", fontWeight: 500, marginBottom: "10px",
      fontFamily: "'Geist', sans-serif",
    }}>{children}</div>
  );
}

// Collapsible disclosure (click-to-expand). Used for liners/sealers, which
// most procedures don't use — keeps the form compact by default.
function Disclosure({ title, summary, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "14px" }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "10px",
          padding: "10px 12px", background: "var(--paper-soft)",
          border: "1px solid var(--rule)", borderRadius: "2px",
          cursor: "pointer", textAlign: "left",
          fontFamily: "'Geist', sans-serif",
          transition: "border-color 140ms ease, background 140ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink-soft)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--rule)"; }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <span style={{
            fontSize: "10px", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--accent)",
            fontWeight: 500,
          }}>{title}</span>
          {summary && (
            <span style={{
              fontSize: "12px", color: "var(--ink-soft)",
              fontStyle: summary === "none selected" ? "italic" : "normal",
            }}>{summary}</span>
          )}
        </div>
        <span aria-hidden style={{
          fontSize: "11px", color: "var(--ink-soft)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 200ms ease",
        }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "14px 4px 4px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Editor card for a single anesthetic injection. Used in the form's
// fields.injections[] list; each injection card has its own drug, needle,
// carpules, side, and technique checkboxes. The × remove button only shows
// when there's more than one injection.
function InjectionEditor({ index, total, injection, tooth, onChange, onRemove }) {
  const set = (k, v) => onChange({ [k]: v });
  const firstTooth = tooth.split(",")[0].trim().replace(/^#/, "").split("-")[0];
  return (
    <div style={{
      border: "1px solid var(--rule)", borderRadius: "2px",
      padding: "14px 16px 6px", marginBottom: "10px",
      background: "var(--paper)",
      position: "relative",
    }}>
      {total > 1 && (
        <button type="button" onClick={onRemove}
          aria-label={`Remove anesthetic ${index + 1}`}
          style={{
            position: "absolute", top: "10px", right: "10px",
            background: "none", border: "none",
            color: "var(--ink-faint)", fontSize: "16px",
            cursor: "pointer", padding: "0 4px", lineHeight: 1,
            transition: "color 100ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-faint)"; }}>
          ×
        </button>
      )}

      <Select value={injection.drug}
        onChange={(v) => set("drug", v)}
        style={{ marginBottom: "12px" }}>
        {ANESTHETIC_OPTIONS.map(opt =>
          <option key={opt} value={opt}>{opt}</option>)}
      </Select>
      <div style={twoCol}>
        <Field>
          <Select value={injection.carpules}
            onChange={(v) => set("carpules", v)}>
            <option value="1/4">¼ carpule</option>
            <option value="1/2">½ carpule</option>
            <option value="1">1 carpule</option>
            <option value="2">2 carpules</option>
            <option value="3">3 carpules</option>
          </Select>
        </Field>
        <Field>
          <RadioToggle value={injection.needle}
            onChange={(v) => set("needle", v)}
            options={["30G 25mm", "27G 35mm"]} />
        </Field>
      </div>
      <Field>
        <RadioToggle value={injection.side}
          onChange={(v) => set("side", v)}
          options={["right", "left"]} />
      </Field>

      <SubsectionLabel>Technique</SubsectionLabel>
      <p style={{ fontSize: "11px", color: "var(--ink-faint)",
          margin: "-6px 0 8px", lineHeight: 1.45, fontStyle: "italic" }}>
        Pick one or more. Topical benzocaine is implied.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px",
          marginBottom: "10px" }}>
        <Checkbox checked={injection.techIAN}
          onChange={(v) => set("techIAN", v)}
          label="IAN + long buccal block" />
        <Checkbox checked={injection.techBuccalInfil}
          onChange={(v) => set("techBuccalInfil", v)}
          label={firstTooth
            ? `Buccal infiltration #${firstTooth}`
            : "Buccal infiltration #(tooth number)"} />
        <Checkbox checked={injection.techMaxInfil}
          onChange={(v) => set("techMaxInfil", v)}
          label="Maxillary buccal infiltration" />
        <Checkbox checked={injection.techGreaterPalatine}
          onChange={(v) => set("techGreaterPalatine", v)}
          label="Greater palatine block" />
        <Checkbox checked={injection.techNasopalatine}
          onChange={(v) => set("techNasopalatine", v)}
          label="Nasopalatine block" />
      </div>
    </div>
  );
}

function SectionHeader({ children, n }) {
  return (
    <div className="serif" style={{
      fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase",
      color: "var(--accent)", fontWeight: 500, marginBottom: "18px",
    }}>
      {children}
    </div>
  );
}

/* ============================================================================
 * RENDERED-PROSE COMPONENT (used in Browse + Walkthrough preview)
 * ==========================================================================*/
/* ============================================================================
 * CODES PANEL — shows CDT codes for the selected procedure.
 *
 * Codes are scraped from the procedure's "steps" chunk in CHUNKS, where the
 * Swade guide consistently lists them with their parenthetical descriptions.
 * Display-only — students still type codes manually into Axium's billing
 * field, which preserves their judgment about which code applies.
 * ==========================================================================*/

// Extract D-codes (CDT codes) from a chunk body, preserving order and
// deduplicating. Returns [{code, desc}, ...].
function extractCodes(text) {
  if (!text) return [];
  const pattern = /(D\d{4}[A-Z]?(?:\.\d)?)(?:\s*\(([^)]+)\))?/g;
  const seen = new Map();
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const code = m[1];
    const desc = (m[2] || "").trim().replace(/\s+/g, " ");
    if (!seen.has(code)) {
      seen.set(code, desc);
    } else if (!seen.get(code) && desc) {
      // Upgrade a previously-undescribed code if a later mention has a desc.
      seen.set(code, desc);
    }
  }
  return Array.from(seen, ([code, desc]) => ({ code, desc }));
}

function CodesPanel({ procedure, chunks }) {
  const codes = useMemo(() => {
    if (!procedure) return [];
    const stepsChunk = findChunkForProcedure(procedure, chunks, "steps");
    if (!stepsChunk) return [];
    return extractCodes(stepsChunk.body);
  }, [procedure, chunks]);

  if (!procedure || codes.length === 0) return null;

  return (
    <div style={{
      ...cardStyle,
      marginBottom: "20px",
      padding: "16px 22px 18px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {codes.map(({ code, desc }) => (
          <div key={code} style={{
            display: "flex", alignItems: "baseline", gap: "10px",
            fontSize: "12px", lineHeight: 1.45,
          }}>
            <span className="mono" style={{
              color: "var(--accent)", fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
              flexShrink: 0, minWidth: "60px",
            }}>{code}</span>
            <span style={{ color: "var(--ink-soft)" }}>
              {desc || <em style={{ color: "var(--ink-faint)" }}>(no description in source)</em>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProseBlock({ text, highlight }) {
  // Strip zero-width spaces. Then rejoin PDF-extraction line wraps the same
  // way renderTemplate does — when a `\n` sits between content and a clear
  // continuation token (lowercase letter, opening parenthesis, ampersand)
  // it's a wrapped sentence, not intentional structure. Bullets, numbered
  // lists, and lines starting with capitals are left alone. Also strip the
  // single-space line indent that the PDF extraction left behind, while
  // preserving multi-space indentation for nested sub-bullets.
  const clean = (text || "")
    .replace(/\u200b/g, "")
    .replace(/(\S)[ \t]*\n[ \t]+([a-z(&])/g, "$1 $2")
    .replace(/(^|\n) (?! )/g, "$1");
  const lines = clean.split("\n");

  // Highlighting helper — wraps query terms in <mark>.
  const highlightLine = (line) => {
    if (!highlight || !highlight.trim()) return line;
    const terms = tokenize(highlight);
    if (terms.length === 0) return line;
    const re = new RegExp(`(${terms.map(t =>
      t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = line.split(re);
    return parts.map((p, i) =>
      re.test(p) ? <mark key={i} style={{
        background: "rgba(212, 165, 116, 0.35)", color: "var(--ink)",
        padding: "0 2px", borderRadius: "1px",
      }}>{p}</mark> : p
    );
  };

  return (
    <div style={{
      fontSize: "14px", lineHeight: 1.7, color: "var(--ink)",
      fontFamily: "'Geist', sans-serif", whiteSpace: "pre-wrap",
    }}>
      {lines.map((ln, i) => {
        if (!ln.trim()) return <div key={i} style={{ height: "10px" }} />;
        const indent = ln.match(/^\s*/)[0].length;
        const stripped = ln.trim();
        // Numbered top-level step. We don't honor the source indent for
        // numbered steps — Swade's PDF extraction left them at 4-6 spaces
        // depending on the section, which reads as awkwardly "off-center."
        // Force them flush-left so they serve as a clean visual anchor.
        const stepM = stripped.match(/^(\d+)\.\s*(.*)/);
        if (stepM && indent < 8) {
          return (
            <div key={i} style={{ display: "flex", gap: "10px",
                marginTop: "8px", paddingLeft: 0 }}>
              <span style={{
                fontFamily: "'Fraunces', serif", fontWeight: 500,
                color: "var(--accent)", minWidth: "22px",
              }}>{stepM[1]}.</span>
              <span>{highlightLine(stepM[2])}</span>
            </div>
          );
        }
        // Bullet styles (○ ■ ●) — preserve hierarchy via padding
        if (/^[○■●]/.test(stripped)) {
          const marker = stripped.charAt(0);
          const rest = stripped.slice(1).trim();
          return (
            <div key={i} style={{
              display: "flex", gap: "10px",
              paddingLeft: `${Math.max(0, indent - 4) * 3 + 14}px`,
              color: "var(--ink-soft)",
            }}>
              <span style={{
                color: marker === "○" ? "var(--ink-faint)" :
                       marker === "■" ? "var(--accent-soft)" :
                       "var(--accent)",
                minWidth: "10px", fontSize: "10px", marginTop: "5px",
              }}>{marker === "●" ? "●" : marker === "■" ? "▪" : "·"}</span>
              <span>{highlightLine(rest)}</span>
            </div>
          );
        }
        return (
          <div key={i} style={{ paddingLeft: `${indent * 3}px` }}>
            {highlightLine(stripped)}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * EXAM FINDINGS — structured form section for COE / POE procedures.
 *
 * The Restorative COE, Perio COE, and POE templates have many "- xxx:" stub
 * lines for clinical findings (TMJ conditions, probing depths, etc.). This
 * component renders a labeled textarea for each, so students can fill them
 * via the form rather than typing into the rendered note. Values are stored
 * in fields.examFindings keyed by the literal stub label, and the renderer
 * substitutes them into matching template lines.
 *
 * The configuration is per-procedure rather than auto-extracted from the
 * template body, so we get sensible groupings and placeholders.
 * ==========================================================================*/

// type: "input" (single-line, default) or "textarea" (multi-line) or
// "select" (dropdown with options). Each field gets a labeled input that
// writes to fields.examFindings[label]. Renderer fills "- <label>:" stubs.
const EXAM_FINDINGS_CONFIG = {
  // Restorative COE — most O-section findings (EOE/TMJ/IOE/oral cancer) and
  // A-section conclusions (TMJ conditions, soft tissue, pulpal dx, etc.) are
  // WNL the vast majority of the time. They sit inside a collapsed Disclosure
  // so the form stays compact; opening it reveals the defaults and lets the
  // student override per finding. The odontogram field is the one piece that
  // needs to be readily expandable, so it lives outside the Disclosure as a
  // dedicated big box that auto-dashes new bullets on Enter.
  "703": [
    {
      title: "EOE/IOE findings",
      disclosure: true,
      summary: "WNL by default · click to override",
      fields: [
        { label: "EOE", type: "textarea",
          placeholder: "WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy" },
        { label: "TMJ", type: "textarea",
          placeholder: "WNL - no deviation, no crepitus, no locking" },
        { label: "IOE", type: "textarea",
          placeholder: "WNL - no soft tissue pathology" },
        { label: "oral cancer screening", type: "textarea",
          placeholder: "WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx" },
        { label: "TMJ conditions", type: "input", placeholder: "WNL" },
        { label: "soft tissue conditions", type: "input", placeholder: "WNL" },
        { label: "caries risk", type: "select",
          options: ["", "Low", "Moderate", "High"] },
        { label: "pulpal diagnosis", type: "input", placeholder: "WNL" },
        { label: "occlusal conditions", type: "input", placeholder: "WNL" },
        { label: "esthetic considerations", type: "input", placeholder: "WNL" },
      ],
    },
    {
      title: "Findings",
      fields: [
        { label: "occlusal assessment", type: "input",
          placeholder: "Class I; no wear facets" },
        { label: "endo testing", type: "input",
          placeholder: "all teeth WNL on cold and percussion" },
        { label: "odontogram", type: "odontogram",
          displayLabel: "Updated odontogram with clinical and radiographic findings",
          placeholder: "List each finding on its own line. Press Enter to add another." },
      ],
    },
  ],
  // Perio COE — perio-chart values are short, so inputs not textareas.
  // Diagnosis is a single dropdown for prognosis (mutually exclusive),
  // not three parallel fields. Radiographic sub-findings dropped — they
  // remain as stubs in the rendered note for the student to fill inline.
  "573": [
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "probing-depths" },
        { label: "bleeding on probing", type: "teeth-selector" },
        { label: "recession", type: "teeth-selector" },
        { label: "furcation", type: "teeth-selector" },
        { label: "mobility", type: "teeth-selector" },
        { label: "mucogingival defects", type: "input", wNLDefault: true },
        { type: "gingiva-dropdowns" },
      ],
    },
    {
      title: "Diagnosis",
      fields: [
        { type: "perio-aap-dropdowns" },
        { type: "perio-ada-dropdown" },
        { label: "prognosis", type: "select",
          options: ["", "fair", "questionable", "hopeless"],
          // Special: this writes to all three of fair/questionable/hopeless
          // by setting the matching one. Custom handler in the component.
          isPrognosis: true },
      ],
    },
  ],
  // POE — same Disclosure pattern as Restorative COE, but POE doesn't have
  // the A-section diagnostic fields, so the Disclosure is shorter.
  "1091": [
    {
      title: "EOE/IOE findings",
      disclosure: true,
      summary: "WNL by default · click to override",
      fields: [
        { label: "EOE", type: "textarea",
          placeholder: "WNL - no soft tissue pathology, no swelling, no asymmetry, no lymphadenopathy" },
        { label: "TMJ", type: "textarea",
          placeholder: "WNL - no deviation, no crepitus, no locking" },
        { label: "IOE", type: "textarea",
          placeholder: "WNL - no soft tissue pathology" },
        { label: "oral cancer screening", type: "textarea",
          placeholder: "WNL - negative for lips, buccal mucosa, dorsal/lateral/ventral tongue, floor of mouth, palate, oropharynx" },
        { label: "caries risk", type: "select",
          options: ["", "Low", "Moderate", "High"] },
      ],
    },
    {
      title: "Findings",
      fields: [
        { label: "endo testing", type: "input",
          placeholder: "all teeth WNL on cold and percussion" },
        { label: "odontogram", type: "odontogram",
          displayLabel: "Updated odontogram with clinical and radiographic findings",
          placeholder: "List each finding on its own line. Press Enter to add another." },
      ],
    },
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "input", placeholder: "" },
        { label: "bleeding on probing", type: "input", placeholder: "" },
        { label: "recession", type: "input", placeholder: "" },
        { label: "furcation", type: "input", placeholder: "" },
        { label: "mobility", type: "input", placeholder: "" },
        { label: "mucogingival defects", type: "input", placeholder: "" },
      ],
    },
  ],
  // Prophy — full perio charting + OHI
  "1196": [
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "probing-depths" },
        { label: "bleeding on probing", type: "teeth-selector" },
        { label: "recession", type: "teeth-selector" },
        { label: "furcation", type: "teeth-selector" },
        { label: "mobility", type: "teeth-selector" },
        { label: "mucogingival defects", type: "input", wNLDefault: true },
        { type: "gingiva-dropdowns" },
      ],
    },
    {
      title: "OHI",
      fields: [
        { type: "brushing-flossing" },
        { label: "plaque area", type: "input", placeholder: "e.g. UR molars, linguals" },
        { label: "nutritional counseling", type: "ohi-checkbox" },
        { label: "tobacco cessation", type: "ohi-checkbox" },
      ],
    },
  ],
  // SRP — probing depths + BOP only (no charting), no gingival dropdowns
  "1272": [
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "probing-depths" },
        { label: "bleeding on probing", type: "teeth-selector" },
      ],
    },
    {
      title: "OHI",
      fields: [
        { type: "brushing-flossing" },
        { label: "plaque area", type: "input", placeholder: "e.g. UR molars, linguals" },
        { label: "nutritional counseling", type: "ohi-checkbox" },
        { label: "tobacco cessation", type: "ohi-checkbox" },
      ],
    },
  ],
  // Perio Re-Evaluation — full charting, no OHI checkboxes (not in template)
  "1346": [
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "probing-depths" },
        { label: "bleeding on probing", type: "teeth-selector" },
        { label: "recession", type: "teeth-selector" },
        { label: "furcation", type: "teeth-selector" },
        { label: "mobility", type: "teeth-selector" },
        { label: "O'Leary plaque index", type: "input", placeholder: "%",
          hint: "Perio Chart → Clipboard → O’Leary" },
        { label: "mucogingival defects", type: "input", wNLDefault: true },
        { type: "gingiva-dropdowns" },
      ],
    },
    {
      title: "OHI",
      fields: [
        { type: "brushing-flossing" },
        { label: "plaque area", type: "input", placeholder: "e.g. UR molars, linguals" },
      ],
    },
  ],
  // Perio Maintenance — full charting + OHI
  "1425": [
    {
      title: "Perio chart",
      fields: [
        { label: "probing depths", type: "probing-depths" },
        { label: "bleeding on probing", type: "teeth-selector" },
        { label: "recession", type: "teeth-selector" },
        { label: "furcation", type: "teeth-selector" },
        { label: "mobility", type: "teeth-selector" },
        { label: "mucogingival defects", type: "input", wNLDefault: true },
        { type: "gingiva-dropdowns" },
      ],
    },
    {
      title: "OHI",
      fields: [
        { type: "brushing-flossing" },
        { label: "plaque area", type: "input", placeholder: "e.g. UR molars, linguals" },
        { label: "nutritional counseling", type: "ohi-checkbox" },
        { label: "tobacco cessation", type: "ohi-checkbox" },
      ],
    },
  ],
};

const titleCaseLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Probing depths field — two dropdowns (1–8mm + "8+") for the typical range.
// Selecting "8+" in either dropdown switches to a free-text input for
// pathological depths. Clearing that text field returns to range mode.
function ProbingDepthsField({ value, onChange }) {
  const opts = ["1","2","3","4","5","6","7","8+"];
  const [manual, setManual] = useState(false);

  // Return to range mode whenever the parent clears the value (form reset).
  useEffect(() => {
    if (!value) setManual(false);
  }, [value]);

  const rangeMatch = (value || "").match(/^(\d+)-(\d+)mm$/);
  const low  = rangeMatch ? rangeMatch[1] : "2";
  const high = rangeMatch ? rangeMatch[2] : "5";
  // Also enter manual mode if value is non-empty but isn't a valid range
  // (e.g. loaded from a previous session where the user had typed free text).
  const isManual = manual || !!(value && !rangeMatch);

  const selStyle = { ...inputStyle, flex: 1, fontSize: "13px" };

  return isManual ? (
    <input type="text" value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder="e.g. generalized 2-5mm; localized 9mm #14"
      style={{ ...inputStyle, fontSize: "13px" }} />
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <select value={low}
        onChange={e => {
          if (e.target.value === "8+") { setManual(true); onChange(""); }
          else onChange(`${e.target.value}-${high}mm`);
        }}
        style={selStyle}>
        {opts.map(o => <option key={o} value={o}>{o === "8+" ? "8+" : `${o}mm`}</option>)}
      </select>
      <span style={{ color: "var(--ink-soft)", fontFamily: "'Geist', sans-serif" }}>–</span>
      <select value={high}
        onChange={e => {
          if (e.target.value === "8+") { setManual(true); onChange(""); }
          else onChange(`${low}-${e.target.value}mm`);
        }}
        style={selStyle}>
        {opts.map(o => <option key={o} value={o}>{o === "8+" ? "8+" : `${o}mm`}</option>)}
      </select>
    </div>
  );
}

// Odontogram findings field — a textarea that auto-inserts "- " on Enter so
// each finding becomes its own bulleted line, and auto-resizes vertically
// as content grows. Students can also drag the resize handle if they want
// even more room. The value is plain text (with literal "- " prefixes) so
// it can be pasted into renderTemplate without any transformation.
function OdontogramField({ value, onChange, placeholder }) {
  const ref = useRef(null);

  // Re-measure the textarea on every value change so its visible height
  // matches its content. Floor at ~3 lines so the empty field still feels
  // like a place to write a list, not a single-line input.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 80) + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const insert = "\n- ";
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    // Restore caret position after React commits the new value.
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.selectionStart = ref.current.selectionEnd =
          start + insert.length;
      }
    });
  };

  return (
    <textarea ref={ref} value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{
        ...inputStyle,
        resize: "vertical", minHeight: "80px",
        fontFamily: "'Geist', sans-serif", fontSize: "13px",
        lineHeight: 1.5,
      }} />
  );
}

// Mini odontogram teeth selector — opens as a dropdown-like panel.
// Value is "" | "generalized" | "#3, #14, #20" etc.
function TeethSelectorPanel({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const isGeneralized = value.trim().toLowerCase() === "generalized";
  const selectedTeeth = new Set(
    isGeneralized ? [] :
    value.split(",")
      .map(t => parseInt(t.trim().replace(/^#/, ""), 10))
      .filter(n => !isNaN(n))
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleTooth = (num) => {
    const next = new Set(selectedTeeth);
    if (next.has(num)) next.delete(num); else next.add(num);
    if (next.size === 0) onChange("");
    else onChange([...next].sort((a, b) => a - b).map(n => `#${n}`).join(", "));
  };

  const setGeneralized = () => onChange(isGeneralized ? "" : "generalized");

  const upperTeeth = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  const lowerTeeth = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];

  const displayValue = value || "";
  const [focused, setFocused] = useState(false);

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      <input readOnly value={displayValue}
        placeholder={placeholder || "select teeth"}
        onClick={() => setOpen(o => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputStyle, cursor: "pointer",
          borderColor: (open || focused) ? "var(--accent)" : "var(--rule)",
          boxShadow: (open || focused) ? "0 0 0 3px rgba(122,26,26,0.08)" : "none",
        }} />
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0,
          background: "var(--paper)", border: "1px solid var(--rule)",
          borderRadius: "3px", padding: "8px",
          zIndex: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}>
          <button onClick={setGeneralized} style={{
            width: "100%", marginBottom: "7px",
            background: isGeneralized ? "var(--accent)" : "var(--paper-soft)",
            color: isGeneralized ? "var(--paper)" : "var(--ink)",
            border: `1px solid ${isGeneralized ? "var(--accent)" : "var(--rule)"}`,
            borderRadius: "2px", padding: "4px 8px",
            fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "'Geist', sans-serif", cursor: "pointer",
          }}>
            Generalized
          </button>
          {/* Upper arch */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "2px", marginBottom: "2px" }}>
            {upperTeeth.map(n => (
              <button key={n} onClick={() => toggleTooth(n)} style={{
                background: selectedTeeth.has(n) ? "var(--accent)" : "transparent",
                color: selectedTeeth.has(n) ? "var(--paper)" : "var(--ink-soft)",
                border: `1px solid ${selectedTeeth.has(n) ? "var(--accent)" : "var(--rule)"}`,
                borderRadius: "2px", fontSize: "8px", padding: "2px 0",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.2, textAlign: "center",
              }}>{n}</button>
            ))}
          </div>
          <div style={{ height: "1px", background: "var(--rule)", margin: "2px 0" }} />
          {/* Lower arch */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "2px", marginTop: "2px" }}>
            {lowerTeeth.map(n => (
              <button key={n} onClick={() => toggleTooth(n)} style={{
                background: selectedTeeth.has(n) ? "var(--accent)" : "transparent",
                color: selectedTeeth.has(n) ? "var(--paper)" : "var(--ink-soft)",
                border: `1px solid ${selectedTeeth.has(n) ? "var(--accent)" : "var(--rule)"}`,
                borderRadius: "2px", fontSize: "8px", padding: "2px 0",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.2, textAlign: "center",
              }}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Small inline reference popup for the circled "?" buttons next to each
// AAP/ADA dropdown. Manages its own open/close state independently.
function HelpPopup({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", verticalAlign: "middle" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "15px", height: "15px",
          borderRadius: "50%",
          border: "1px solid var(--ink-faint)",
          background: "transparent",
          color: "var(--ink-soft)",
          fontSize: "9px",
          fontFamily: "serif",
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >?</button>
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 5px)",
          left: 0,
          zIndex: 200,
          width: "240px",
          background: "var(--paper)",
          border: "1px solid var(--rule)",
          borderRadius: "4px",
          padding: "10px 12px 10px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
          fontSize: "11px",
          lineHeight: 1.55,
          color: "var(--ink)",
          fontFamily: "'Geist', sans-serif",
        }}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              float: "right",
              background: "none", border: "none",
              color: "var(--ink-soft)", cursor: "pointer",
              fontSize: "13px", padding: "0 0 6px 10px",
              lineHeight: 1,
            }}
          >✕</button>
          {children}
        </div>
      )}
    </span>
  );
}

function ExamFindings({ procedureId, findings, setFindings }) {
  const config = EXAM_FINDINGS_CONFIG[procedureId];
  if (!config) return null;

  const update = (label, value) => {
    setFindings({ ...findings, [label]: value });
  };

  // Batch-update multiple keys at once — avoids stale-closure overwrite
  // when two or more keys need to change together (e.g. AAP stage + grade + combined).
  const batchUpdate = (updates) => {
    setFindings({ ...findings, ...updates });
  };

  // Prognosis is an exclusive choice — selecting "fair" should set
  // findings.fair = "X" (matching the radio-button-like convention in the
  // source notes) and clear questionable/hopeless. Selecting blank clears all.
  const updatePrognosis = (value) => {
    const next = { ...findings };
    delete next.fair;
    delete next.questionable;
    delete next.hopeless;
    next.prognosis = value;  // remembered so the dropdown re-renders correctly
    if (value) next[value] = "X";
    setFindings(next);
  };

  // Initialize wNLDefault fields to "WNL" when the procedure loads.
  useEffect(() => {
    const allFields = config.flatMap(s => s.fields || []);
    const wNLFields = allFields.filter(f => f.wNLDefault && f.label);
    if (wNLFields.length === 0) return;
    const updates = {};
    wNLFields.forEach(f => {
      if (findings[f.label] === undefined || findings[f.label] === null) {
        updates[f.label] = "WNL";
      }
    });
    if (Object.keys(updates).length > 0) setFindings({ ...findings, ...updates });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureId]);

  const renderField = (field) => {
    // --- Special composite fields (no label key) ---
    if (field.type === "gingiva-dropdowns") {
      const colorOpts = ["pink", "red", "pigmented"];
      const contourOpts = ["scalloped", "blunted"];
      const consOpts = ["firm", "soft"];
      const selStyle = { ...inputStyle, fontSize: "13px", flex: 1, minWidth: 0 };
      return (
        <div key="gingiva-dropdowns" style={{ marginBottom: "9px" }}>
          <label style={{ ...labelStyle, fontSize: "10px", textTransform: "none",
            letterSpacing: "0.04em", color: "var(--ink-soft)", fontStyle: "italic" }}>
            Gingiva
          </label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <select value={findings["gingival color"] || "pink"}
              onChange={e => update("gingival color", e.target.value)}
              style={selStyle}>
              {colorOpts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={findings["gingival contour"] || "scalloped"}
              onChange={e => update("gingival contour", e.target.value)}
              style={selStyle}>
              {contourOpts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={findings["gingival consistency"] || "firm"}
              onChange={e => update("gingival consistency", e.target.value)}
              style={selStyle}>
              {consOpts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <span style={{ color: "var(--ink-soft)", fontSize: "13px",
                fontFamily: "'Geist', sans-serif", whiteSpace: "nowrap" }}>
              gingiva
            </span>
          </div>
        </div>
      );
    }

    if (field.type === "brushing-flossing") {
      const brushOpts = ["1x", "2x", "3x"];
      const flossOpts = ["1x/week", "2x/week", "3-4x/week", "1x/day"];
      const selStyle = { ...inputStyle, fontSize: "13px" };
      return (
        <div key="brushing-flossing" style={{ marginBottom: "9px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", textTransform: "none",
                letterSpacing: "0.04em", color: "var(--ink-soft)", fontStyle: "italic" }}>
                Brushing
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <select value={findings["brushing frequency"] || "2x"}
                  onChange={e => update("brushing frequency", e.target.value)}
                  style={{ ...selStyle, flex: 1 }}>
                  {brushOpts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <span style={{ color: "var(--ink-soft)", fontSize: "12px",
                    fontFamily: "'Geist', sans-serif", whiteSpace: "nowrap" }}>
                  /day
                </span>
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", textTransform: "none",
                letterSpacing: "0.04em", color: "var(--ink-soft)", fontStyle: "italic" }}>
                Flossing
              </label>
              <select value={findings["flossing frequency"] || "1x/week"}
                onChange={e => update("flossing frequency", e.target.value)}
                style={selStyle}>
                {flossOpts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (field.type === "perio-aap-dropdowns") {
      const stage = findings["AAP stage"] || "";
      const grade = findings["AAP grade"] || "";
      const selStyle = { ...inputStyle, fontSize: "13px", width: "56px", padding: "6px 8px" };
      const updateAAP = (newStage, newGrade) => {
        const combined = [
          newStage && `Stage ${newStage}`,
          newGrade && `Grade ${newGrade}`,
        ].filter(Boolean).join(", ");
        batchUpdate({ "AAP stage": newStage, "AAP grade": newGrade, "AAP": combined });
      };
      return (
        <div key="perio-aap-dropdowns" style={{ marginBottom: "9px" }}>
          <label style={{
            ...labelStyle, fontSize: "10px", textTransform: "none",
            letterSpacing: "0.04em", color: "var(--ink-soft)", fontStyle: "italic",
          }}>AAP</label>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            {/* Stage */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "11px", color: "var(--ink-soft)",
                  fontFamily: "'Geist', sans-serif" }}>Stage</span>
              <select value={stage}
                onChange={e => updateAAP(e.target.value, grade)}
                style={selStyle}>
                <option value="">—</option>
                {["I","II","III","IV"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <HelpPopup>
                <div style={{ fontWeight: 600, marginBottom: "7px" }}>Staging criteria</div>
                {[
                  ["I",   "CAL 1–2mm, PD ≤4mm, no tooth loss due to perio"],
                  ["II",  "CAL 3–4mm, PD ≤5mm, no tooth loss due to perio"],
                  ["III", "CAL ≥5mm, PD ≥6mm, ≤4 teeth lost"],
                  ["IV",  "Stage III + masticatory dysfunction (≤20 teeth, bite collapse…)"],
                ].map(([s, d]) => (
                  <div key={s} style={{ marginBottom: "5px" }}>
                    <strong>Stage {s}</strong> — {d}
                  </div>
                ))}
              </HelpPopup>
            </div>
            {/* Grade */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "11px", color: "var(--ink-soft)",
                  fontFamily: "'Geist', sans-serif" }}>Grade</span>
              <select value={grade}
                onChange={e => updateAAP(stage, e.target.value)}
                style={selStyle}>
                <option value="">—</option>
                {["A","B","C"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <HelpPopup>
                <div style={{ fontWeight: 600, marginBottom: "7px" }}>Grading criteria</div>
                {[
                  ["A", "No progression in 5 yrs, non-smoker, normoglycemic"],
                  ["B", "Evidence of progression, <10 cigs/day, HbA1c <7%"],
                  ["C", "Rapid progression, ≥10 cigs/day, HbA1c ≥7%"],
                ].map(([g, d]) => (
                  <div key={g} style={{ marginBottom: "5px" }}>
                    <strong>Grade {g}</strong> — {d}
                  </div>
                ))}
              </HelpPopup>
            </div>
          </div>
        </div>
      );
    }

    if (field.type === "perio-ada-dropdown") {
      const caseType = findings["ADA case type"] || "";
      const selStyle = { ...inputStyle, fontSize: "13px" };
      const updateADA = (newType) => {
        const combined = newType ? `Case Type ${newType}` : "";
        batchUpdate({ "ADA case type": newType, "ADA": combined });
      };
      return (
        <div key="perio-ada-dropdown" style={{ marginBottom: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px",
              marginBottom: "5px" }}>
            <label style={{
              ...labelStyle, fontSize: "10px", textTransform: "none",
              letterSpacing: "0.04em", color: "var(--ink-soft)", fontStyle: "italic",
              marginBottom: 0,
            }}>ADA</label>
            <HelpPopup>
              <div style={{ fontWeight: 600, marginBottom: "7px" }}>ADA Case Type</div>
              {[
                ["I",   "Gingivitis (no bone loss, reversible)"],
                ["II",  "Early periodontitis (≤25% bone loss)"],
                ["III", "Moderate periodontitis (25–50% bone loss)"],
                ["IV",  "Advanced periodontitis (>50% bone loss)"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: "5px" }}>
                  <strong>Type {t}</strong> — {d}
                </div>
              ))}
            </HelpPopup>
          </div>
          <select value={caseType}
            onChange={e => updateADA(e.target.value)}
            style={selStyle}>
            <option value="">— Case Type —</option>
            {["I","II","III","IV"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    // --- Standard labeled fields ---
    const isProgn = field.isPrognosis;
    const value = isProgn
      ? (findings.prognosis || "")
      : (findings[field.label] !== undefined ? findings[field.label] : (field.wNLDefault ? "WNL" : ""));
    const onChange = isProgn
      ? (e) => updatePrognosis(e.target.value)
      : (e) => update(field.label, e.target.value);
    const display = isProgn
      ? "Prognosis"
      : (field.displayLabel || titleCaseLabel(field.label));

    if (field.type === "ohi-checkbox") {
      const checked = !!findings[field.label];
      return (
        <div key={field.label} style={{ marginBottom: "6px" }}>
          <label style={{
            display: "flex", alignItems: "center", gap: "9px",
            fontSize: "13px", color: "var(--ink)", cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
          }}>
            <input type="checkbox" checked={checked}
              onChange={e => update(field.label, e.target.checked)}
              style={{ width: "15px", height: "15px",
                accentColor: "var(--accent)", cursor: "pointer" }} />
            <span style={{ color: "var(--ink-soft)", fontSize: "12px" }}>
              {titleCaseLabel(field.label)}
            </span>
          </label>
        </div>
      );
    }

    return (
      <div key={field.label} style={{ marginBottom: "9px" }}>
        <label style={{
          ...labelStyle,
          fontSize: "10px",
          textTransform: "none",
          letterSpacing: "0.04em",
          color: "var(--ink-soft)",
          fontStyle: "italic",
        }}>
          {display}
        </label>
        {field.type === "textarea" ? (
          <textarea value={value} onChange={onChange}
            placeholder={field.placeholder} rows={1}
            style={{
              ...inputStyle,
              resize: "vertical", minHeight: "32px",
              fontFamily: "'Geist', sans-serif", fontSize: "13px",
            }} />
        ) : field.type === "select" ? (
          <select value={value} onChange={onChange}
            style={{ ...inputStyle, fontSize: "13px" }}>
            {field.options.map(opt => (
              <option key={opt} value={opt}>
                {opt || "— Select —"}
              </option>
            ))}
          </select>
        ) : field.type === "odontogram" ? (
          <OdontogramField value={value}
            onChange={(v) => update(field.label, v)}
            placeholder={field.placeholder} />
        ) : field.type === "teeth-selector" ? (
          <TeethSelectorPanel value={value}
            onChange={(v) => update(field.label, v)}
            placeholder={field.placeholder} />
        ) : field.type === "probing-depths" ? (
          <ProbingDepthsField value={value}
            onChange={(v) => update(field.label, v)} />
        ) : (
          <input type="text" value={value}
            onChange={e => update(field.label, e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, fontSize: "13px" }} />
        )}
        {field.hint && (
          <div style={{
            marginTop: "4px", fontSize: "10px",
            color: "var(--ink-faint)", fontFamily: "'Geist', sans-serif",
            fontStyle: "italic", letterSpacing: "0.02em",
          }}>{field.hint}</div>
        )}
      </div>
    );
  };

  return (
    <>
      {config.map((section, i) => {
        const fields = section.fields.map(renderField);
        if (section.disclosure) {
          return (
            <div key={i} style={{ marginTop: i === 0 ? "4px" : "16px" }}>
              <Disclosure
                title={section.title}
                summary={section.summary}
                defaultOpen={false}
              >
                {fields}
              </Disclosure>
            </div>
          );
        }
        return (
          <div key={i} style={{ marginTop: i === 0 ? "4px" : "16px" }}>
            <SubsectionLabel>{section.title}</SubsectionLabel>
            {fields}
          </div>
        );
      })}
    </>
  );
}

/* ============================================================================
 * NOTE BUILDER  (full-feature port of the previous artifact)
 * ==========================================================================*/
function NoteBuilder({ selectedProcedureId, onSelectProcedure,
                       fields, setFields, note, setNote,
                       userEdited, setUserEdited }) {
  // Initial state derives from the App-level selection, but ongoing sync
  // happens in the useEffect below — useState only reads the initial value
  // once at mount.
  const initialProc = selectedProcedureId ? findProcedure(selectedProcedureId) : null;
  const [categoryId, setCategoryId] = useState(initialProc?.categoryId || "");
  const [procedureId, setProcedureId] = useState(selectedProcedureId || "");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  // Sync local state with the App-level selection (e.g. when user navigates
  // here from Browse with a procedure already chosen). When the procedure
  // genuinely changes, we clear the note so the regeneration effect kicks
  // in. When App says "no selection" but we have one, clear ours too.
  useEffect(() => {
    if (selectedProcedureId && selectedProcedureId !== procedureId) {
      const proc = findProcedure(selectedProcedureId);
      if (proc) {
        setCategoryId(proc.categoryId);
        setProcedureId(selectedProcedureId);
        setNote("");
        setUserEdited(false);
      }
    } else if (!selectedProcedureId && procedureId) {
      setProcedureId("");
      setNote("");
      setUserEdited(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProcedureId]);

  const currentCategory = useMemo(
    () => FLAT_CATEGORIES.find(c => c.id === categoryId), [categoryId]);
  const currentProcedure = useMemo(
    () => currentCategory?.procedures.find(p => p.id === procedureId),
    [currentCategory, procedureId]);
  const rawTemplate = useMemo(
    () => (procedureId ? TEMPLATES[procedureId] : ""), [procedureId]);

  // Derive "what sections does this procedure need?" from the raw template.
  // - Anesthetic: only if the template contains the standard administered
  //   sentence.
  // - Liners: only if the template mentions Vitrebond / Consepsis / Gluma.
  // - Tooth: only if the template contains a tooth reference like #19 or #19-MOD.
  // - Shade: only if the template mentions the word "shade" (covers both
  //   "Selected shade A2" and "Shade A2 Renamel" phrasings).
  // - Per-field flags for header items: each one is shown only when the
  //   template actually has a corresponding line. Important for medications,
  //   which only 5 of 61 templates use — adding it everywhere would let
  //   students fill in a field that does nothing.
  // This is more robust than hand-curating a list — when the templates
  // change, the form updates automatically.
  const needsAnesthetic = useMemo(
    () => /Applied 20% topical benzocaine/.test(rawTemplate), [rawTemplate]);
  const needsLiners = useMemo(
    () => /Vitrebond|Consepsis|Gluma/.test(rawTemplate), [rawTemplate]);
  const needsTooth = useMemo(
    () => /#[A-Z0-9]+(-[A-Z]+)?/.test(rawTemplate), [rawTemplate]);
  const needsShade = useMemo(
    () => /\bshade\b/i.test(rawTemplate), [rawTemplate]);
  const needsMedHistory = useMemo(
    () => /medical history:/i.test(rawTemplate), [rawTemplate]);
  const needsMedications = useMemo(
    () => /medications:/i.test(rawTemplate), [rawTemplate]);
  const needsAllergies = useMemo(
    () => /allergies:/i.test(rawTemplate), [rawTemplate]);
  const needsBP = useMemo(
    () => /blood pressure:/i.test(rawTemplate), [rawTemplate]);
  const needsBG = useMemo(
    () => /blood glucose:/i.test(rawTemplate), [rawTemplate]);
  const needsTemp = useMemo(
    () => /temperature:/i.test(rawTemplate), [rawTemplate]);
  const needsNV = useMemo(
    () => /NV:/.test(rawTemplate), [rawTemplate]);
  // The text following "NV:" in the template, if any. Mirrored into the form's
  // placeholder so students can see what the default would be without typing.
  // If they leave the field empty, renderTemplate keeps the template's default
  // verbatim; if they type something, it overrides.
  const nvDefault = useMemo(() => {
    const m = rawTemplate.match(/(?:^|\n)[ \t]*-?[ \t]*NV:[ \t]*([^\n]*)/);
    return m ? m[1].trim() : "";
  }, [rawTemplate]);
  const needsCC = useMemo(
    () => /(?:CC:|Chief complaint:)\s*“/.test(rawTemplate), [rawTemplate]);
  const needsNitrous = useMemo(
    () => /Titrated to[^.]*nitrous/i.test(rawTemplate), [rawTemplate]);

  // Regenerate the note when needed.
  //
  // State is lifted to App level, which means NoteBuilder remounts on tab
  // switch but state persists. We must NOT regenerate on remount when the
  // procedure is unchanged — that would clobber the user's preserved work.
  //
  // The signal: regenerate only if `note` is empty. Procedure changes set
  // note to "" explicitly via handleProcedureChange, which triggers this
  // effect to refill it. On a fresh tab-switch remount, note is non-empty
  // so we leave it alone.
  useEffect(() => {
    if (!procedureId) return;
    if (note !== "") return;
    setNote(renderTemplate(rawTemplate, fields));
    setUserEdited(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureId, rawTemplate, note]);

  // Regenerate the note when FIELDS change — but only if the user hasn't
  // started editing the textarea directly. Once they edit, the note is
  // theirs; further form changes won't blow away their work. They can opt
  // back in via the "Restore from template" button.
  useEffect(() => {
    if (!procedureId) return;
    if (userEdited) return;
    setNote(renderTemplate(rawTemplate, fields));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  const setField = (k, v) => setFields(p => ({ ...p, [k]: v }));
  // When category changes, clear local procedure AND lift that change up
  // so the App-level selection doesn't go stale. Also clear the note since
  // there's no procedure to generate one for.
  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setProcedureId("");
    onSelectProcedure("");
    setNote("");
    setUserEdited(false);
  };
  // When procedure changes, propagate to App and clear the note so the
  // useEffect regenerates it from the new template.
  const handleProcedureChange = (id) => {
    setProcedureId(id);
    onSelectProcedure(id);
    setNote("");
    setUserEdited(false);
  };
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(note); setCopied(true);
      setTimeout(() => setCopied(false), 1800); }
    catch { textareaRef.current?.select(); }
  };
  const handleReset = () => {
    setFields(DEFAULT_FIELDS);
    if (procedureId) setNote(renderTemplate(rawTemplate, DEFAULT_FIELDS));
  };
  const handleRestoreTemplate = () => {
    setNote(renderTemplate(rawTemplate, fields));
    setUserEdited(false);
  };

  return (
    <>
      <div className="layout" style={{
      display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr",
      gap: "44px",
    }}>
      <section>
        <div style={cardStyle}>
          <Field label="Category">
            <Select value={categoryId} onChange={handleCategoryChange} prominent>
              <option value="">— Select a category —</option>
              {FLAT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Procedure">
            <Select value={procedureId} onChange={handleProcedureChange} prominent>
              <option value="">{currentCategory ? "— Pick a procedure —" : "—"}</option>
              {currentCategory?.procedures.map(p =>
                <option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </Field>
        </div>

        {procedureId && (
          <div style={{ ...cardStyle, marginTop: "24px" }}>
          {(procedureId === "1091" || procedureId === "1425") && (
            <div style={{
              marginBottom: "16px",
              padding: "10px 14px",
              background: "var(--paper-soft)",
              borderLeft: "2px solid var(--gold)",
              borderRadius: "2px",
              fontSize: "11px", lineHeight: 1.5,
              color: "var(--ink-soft)",
            }}>
              <strong style={{ color: "var(--ink)" }}>Reminder:</strong> check
              the date of the patient's last bitewings.
            </div>
          )}
          {userEdited && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              background: "rgba(122, 30, 30, 0.06)",
              border: "1px solid var(--accent)",
              borderRadius: "2px",
              padding: "10px 12px", marginBottom: "16px",
              fontSize: "12px", lineHeight: 1.5,
            }}>
              <span style={{
                color: "var(--accent)", fontWeight: 500,
                fontSize: "13px", lineHeight: 1, marginTop: "1px",
              }}>!</span>
              <div style={{ flex: 1, color: "var(--ink)" }}>
                <strong style={{ color: "var(--accent)" }}>Note is locked from your edits.</strong>{" "}
                Field changes below won&apos;t flow to the note until you click{" "}
                <em className="serif" style={{ color: "var(--accent)" }}>Restore from template</em>{" "}
                above the note (which discards your manual edits).
              </div>
              <button type="button"
                onClick={() => {
                  setNote(renderTemplate(rawTemplate, fields));
                  setUserEdited(false);
                }}
                style={{
                  flexShrink: 0,
                  background: "var(--accent)", color: "var(--paper)",
                  border: "none", borderRadius: "2px",
                  padding: "6px 10px", fontSize: "10px",
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 500, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                Restore
              </button>
            </div>
          )}
          <div style={twoCol}>
            <Field label="Age (max 89)">
              <AgeInput value={fields.age} onChange={v=>setField("age",v)} />
            </Field>
            <Field label="Gender">
              <Select value={fields.gender} onChange={v=>setField("gender",v)}>
                <option value="">—</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </Select>
            </Field>
          </div>
          {procedureId !== "871" && (
            <Field label="Clinic">
              <Select value={fields.clinic} onChange={v=>setField("clinic",v)}>
                <option value="">— Select a clinic —</option>
                <option value="Gershwin">Gershwin</option>
                <option value="Vivaldi">Vivaldi</option>
                <option value="Brahms">Brahms</option>
                <option value="Bach">Bach</option>
                <option value="Mozart">Mozart</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Chicago">Chicago</option>
                <option value="UGOS">UGOS</option>
              </Select>
            </Field>
          )}
          {needsCC && (
            <>
              <Hairline />
              <Field label="Chief Complaint">
                <TextInput value={fields.cc} onChange={v=>setField("cc",v)}
                  placeholder='e.g. I have pain in my tooth.' />
              </Field>
            </>
          )}
          {(procedureId === "273" || procedureId === "871") && (
            <>
              <Hairline />
              <label style={{
                display: "flex", alignItems: "center", gap: "10px",
                fontSize: "13px", color: "var(--ink)",
                cursor: "pointer", padding: "6px 0",
              }}>
                <input type="checkbox"
                  checked={fields.accepted !== false}
                  onChange={e => setField("accepted", e.target.checked)}
                  style={{ width: "16px", height: "16px",
                    accentColor: "var(--accent)", cursor: "pointer" }} />
                <span>Accepted?</span>
                <span style={{ color: "var(--ink-faint)", fontSize: "11px",
                    fontStyle: "italic", marginLeft: "auto" }}>
                  uncheck to remove
                </span>
              </label>
            </>
          )}
          {(needsTooth || needsShade) && (
            <>
              <Hairline />
              <div style={twoCol}>
                {needsTooth && (
                  <Field label={["2742","2821","3002","871"].includes(procedureId) ? "Tooth" : "Tooth & Surfaces"}>
                    <ToothInput value={fields.tooth}
                      onChange={v=>setField("tooth",v)}
                      placeholder={["2742","2821","3002","871"].includes(procedureId) ? "e.g. #19" : "#19-MO     or     #19-MO, #24-L"} />
                  </Field>
                )}
                {needsShade && (
                  <Field label="Shade">
                    <TextInput value={fields.shade} onChange={v=>setField("shade",v)} placeholder="e.g. A2" />
                  </Field>
                )}
              </div>
            </>
          )}
          {/* Crown-specific controls: New?, Placed cord?, Crown Type */}
          {["2742","2821","3002"].includes(procedureId) && (
            <>
              <Hairline />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["2821","3002"].includes(procedureId) && (
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <label style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "13px", color: "var(--ink)", cursor: "pointer",
                    }}>
                      <input type="checkbox"
                        checked={fields.crownIsNew !== false}
                        onChange={e => setField("crownIsNew", e.target.checked)}
                        style={{ width: "15px", height: "15px",
                          accentColor: "var(--accent)", cursor: "pointer" }} />
                      <span>New?</span>
                    </label>
                    <label style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "13px", color: "var(--ink)", cursor: "pointer",
                    }}>
                      <input type="checkbox"
                        checked={fields.cordPlaced === true}
                        onChange={e => setField("cordPlaced", e.target.checked)}
                        style={{ width: "15px", height: "15px",
                          accentColor: "var(--accent)", cursor: "pointer" }} />
                      <span>Placed cord?</span>
                    </label>
                    {fields.cordPlaced && (
                      <div style={{ minWidth: "160px" }}>
                        <Select value={fields.cordSize || "0"} onChange={v => setField("cordSize", v)}>
                          <option value="000">000 — Ultra Fine</option>
                          <option value="00">00 — Extra Fine</option>
                          <option value="0">0 — Fine</option>
                          <option value="1">1 — Medium</option>
                          <option value="2">2 — Thick</option>
                          <option value="3">3 — Extra Thick</option>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                {["2742","2821"].includes(procedureId) && (
                  <Field label="Crown Type">
                    <Select value={fields.crownType || "PFM"} onChange={v => setField("crownType", v)}>
                      <option value="PFM">PFM</option>
                      <option value="all-ceramic">All-Ceramic</option>
                    </Select>
                  </Field>
                )}
              </div>
            </>
          )}
          {(needsMedHistory || needsMedications || needsAllergies ||
            needsBP || needsBG) && (
            <>
              <Hairline />
              {needsMedHistory && (
                <Field label="Medical History">
                  <TextInput value={fields.medHistory} onChange={v=>setField("medHistory",v)} placeholder="RMH; no changes" />
                </Field>
              )}
              {needsMedications && (
                <Field label="Medications">
                  <TextInput value={fields.medications} onChange={v=>setField("medications",v)} placeholder="none / list meds" />
                </Field>
              )}
              {(needsAllergies || needsBP || needsBG) && (
                <div style={threeCol}>
                  {needsAllergies && (
                    <Field label="Allergies">
                      <TextInput value={fields.allergies} onChange={v=>setField("allergies",v)} placeholder="NKDA" />
                    </Field>
                  )}
                  {needsBP && (
                    <Field label="BP">
                      <TextInput value={fields.bp} onChange={v=>setField("bp",v)} placeholder="120/80" />
                    </Field>
                  )}
                  {needsBG && (
                    <Field label="Blood Glucose">
                      <TextInput value={fields.bg} onChange={v=>setField("bg",v)} placeholder="(blank to omit)" />
                    </Field>
                  )}
                </div>
              )}
            </>
          )}

          {EXAM_FINDINGS_CONFIG[procedureId] && (
            <>
              <Hairline />
              <ExamFindings
                procedureId={procedureId}
                findings={fields.examFindings || {}}
                setFindings={(f) => setField("examFindings", f)} />
            </>
          )}

          {procedureId === "1346" && (
            <>
              <Hairline />
              <SubsectionLabel>Assessment</SubsectionLabel>
              <Field label="Periodontal health">
                <Select value={fields.perioImproved || "improved"}
                  onChange={v => setField("perioImproved", v)}>
                  <option value="improved">improved</option>
                  <option value="not improved">has not improved</option>
                </Select>
              </Field>
              <Field label="Rationale">
                <TextInput
                  value={fields.perioImprovementDetail || ""}
                  onChange={v => setField("perioImprovementDetail", v)}
                  placeholder="e.g. decrease in probing depths" />
              </Field>
            </>
          )}

          {needsNitrous && (
            <>
              <Hairline />
              <SubsectionLabel>Nitrous</SubsectionLabel>
              <label style={{
                display: "flex", alignItems: "center", gap: "10px",
                fontSize: "13px", color: "var(--ink)",
                cursor: "pointer", padding: "6px 0",
              }}>
                <input type="checkbox"
                  checked={fields.nitrous !== false}
                  onChange={e => setField("nitrous", e.target.checked)}
                  style={{
                    width: "16px", height: "16px",
                    accentColor: "var(--accent)", cursor: "pointer",
                  }} />
                <span>Administered nitrous oxide</span>
                <span style={{ color: "var(--ink-faint)", fontSize: "11px",
                    fontStyle: "italic", marginLeft: "auto" }}>
                  uncheck to omit from note
                </span>
              </label>
            </>
          )}

          {needsAnesthetic && (
            <>
              <Hairline />
              {/* Anesthetic — list of injections (default: one). Only shown
                  when the procedure's template actually uses anesthetic. */}
              <SubsectionLabel>Anesthetic</SubsectionLabel>
              {fields.injections.map((inj, idx) => (
                <InjectionEditor key={idx}
                  index={idx}
                  total={fields.injections.length}
                  injection={inj}
                  tooth={fields.tooth}
                  onChange={(patch) => {
                    const next = [...fields.injections];
                    next[idx] = { ...next[idx], ...patch };
                    setField("injections", next);
                  }}
                  onRemove={() => {
                    const next = fields.injections.filter((_, i) => i !== idx);
                    setField("injections", next.length > 0 ? next : [{ ...DEFAULT_INJECTION }]);
                  }} />
              ))}
              <button type="button"
                onClick={() => setField("injections",
                  [...fields.injections, { ...DEFAULT_INJECTION }])}
                style={{
                  width: "100%", padding: "10px 12px", marginTop: "4px",
                  background: "transparent",
                  border: "1px dashed var(--rule)",
                  color: "var(--ink-soft)", borderRadius: "2px",
                  fontSize: "12px", fontFamily: "'Geist', sans-serif",
                  cursor: "pointer", letterSpacing: "0.04em",
                  transition: "border-color 140ms ease, color 140ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--rule)";
                  e.currentTarget.style.color = "var(--ink-soft)";
                }}>
                + Add another anesthetic
              </button>
            </>
          )}

          {needsLiners && (
            <>
              <Hairline />
              {/* Liner / sealer toggles — only shown when the procedure's
                  template actually uses Vitrebond / Consepsis / Gluma. */}
              <Disclosure title="Liners & sealers"
                summary={[
                  fields.vitrebond && "Vitrebond",
                  fields.consepsis && "Consepsis",
                  fields.gluma && "Gluma",
                ].filter(Boolean).join(", ")}>
                <p style={{ fontSize: "11px", color: "var(--ink-faint)",
                    margin: "0 0 10px", lineHeight: 1.45, fontStyle: "italic" }}>
                  Check any liners or sealers you used. Each adds the corresponding
                  step to the note in the standard manual phrasing.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <Checkbox checked={fields.vitrebond}
                    onChange={v=>setField("vitrebond",v)}
                    label="Vitrebond"
                    hint="0.5 mm liner in deepest area of prep" />
                  <Checkbox checked={fields.consepsis}
                    onChange={v=>setField("consepsis",v)}
                    label="Consepsis"
                    hint="Disinfect — scrub 10s, rinse, dry" />
                  <Checkbox checked={fields.gluma}
                    onChange={v=>setField("gluma",v)}
                    label="Gluma"
                    hint="Desensitizer — 45s, dry, rinse, dry" />
                </div>
              </Disclosure>
            </>
          )}

          {needsNV && (
            <>
              <Hairline />
              <Field label="Next Visit (NV)">
                <TextInput value={fields.nv} onChange={v=>setField("nv",v)}
                  placeholder={nvDefault || "e.g. #19 crown prep"} />
              </Field>
            </>
          )}
          <Hairline />
          <Field label="Name(s)">
            <TextInput value={fields.names} onChange={v=>setField("names",v)}
              placeholder="e.g. S.Swade/Dr. Nice" />
          </Field>
          <button className="ghost" onClick={handleReset} style={{ width: "100%", marginTop: "10px" }}>
            Clear patient fields
          </button>
        </div>
        )}
      </section>

      <section className="note-pane" style={{
        position: "sticky", top: "24px", alignSelf: "start",
        // The grid layout would otherwise stretch this column to match the
        // form's height, defeating sticky. align-self: start keeps it at the
        // top of its grid track so position: sticky has somewhere to stick.
      }}>
        {procedureId ? (
          <div className="fade-in" key={procedureId}>
            <textarea ref={textareaRef} className="note-area" value={note} spellCheck={false}
              onChange={(e) => { setNote(e.target.value); setUserEdited(true); }} />
            {userEdited && (
              <p style={{ marginTop: "10px", fontSize: "12px",
                  color: "var(--accent)", lineHeight: 1.55,
                  transition: "color 200ms ease", marginBottom: "12px",
                }}>
                Your edits are preserved. Form changes won&apos;t update the note —
                use <em className="serif" style={{ color: "var(--accent)" }}>Restore from template</em>{" "}
                to discard your edits and regenerate.
              </p>
            )}
            {userEdited && (
              <button className="ghost" onClick={handleRestoreTemplate}
                style={{ fontSize: "12px", padding: "8px 0", marginBottom: "12px" }}>
                Restore from template
              </button>
            )}
            <div style={{
              ...cardStyle,
              marginBottom: "20px",
              padding: "16px 22px 18px",
              display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                {(() => {
                  const proc = findProcedure(procedureId);
                  if (!proc) return null;
                  const stepsChunk = findChunkForProcedure(proc, CHUNKS, "steps");
                  if (!stepsChunk) return null;
                  const codes = extractCodes(stepsChunk.body);
                  return codes.map(({ code, desc }) => (
                    <div key={code} style={{
                      display: "flex", alignItems: "baseline", gap: "10px",
                      fontSize: "12px", lineHeight: 1.45,
                    }}>
                      <span className="mono" style={{
                        color: "var(--accent)", fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                        flexShrink: 0, minWidth: "60px",
                        cursor: "pointer", transition: "opacity 140ms ease",
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = "0.7"}
                      onMouseLeave={(e) => e.target.style.opacity = "1"}
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                      }}>{code}</span>
                      <span style={{ color: "var(--ink-soft)" }}>
                        {desc || <em style={{ color: "var(--ink-faint)" }}>(no description in source)</em>}
                      </span>
                    </div>
                  ));
                })()}
              </div>
              <button className="primary" disabled={!note} onClick={handleCopy}
                style={{
                  opacity: note ? 1 : 0.4, cursor: note ? "pointer" : "not-allowed",
                  width: "56px", height: "56px", padding: "0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: "12px", fontWeight: 500,
                }}>
                {copied ? "✓" : "COPY"}
              </button>
            </div>
            <PrivacyBanner />
          </div>
        ) : (
          <div className="empty-state">
            <div>
              <div className="serif" style={{ fontSize: "22px", fontWeight: 300,
                  marginBottom: "10px", fontStyle: "italic" }}>
                Note
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
    </>
  );
}

/* ============================================================================
 * PRIVACY BANNER  —  persistent reminder shown above the Note Builder.
 * Patient info entered here lives only in the user's browser memory and is
 * never sent anywhere, but the generated note still ends up pasted into
 * Axium, so we want students thinking about PHI before they type anything.
 * ==========================================================================*/
/* ============================================================================
 * CLOCK PANEL — large digital clock + optional Axium auto-logout timer.
 *
 * Lives in the Note Builder right column, above the chart note. Visible only
 * when chairside (i.e. when you're actually generating a note), not on the
 * Browse or Prep List pages. Both pieces are designed to glance-read from
 * across the operatory.
 * ==========================================================================*/

// Format hours/mins/secs for the wall clock. 12-hour with AM/PM reads more
// naturally for clinic ("until 11:30") than military time.
function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    // Align the first tick to the next second boundary so the seconds digit
    // changes precisely when it should, not at some random offset.
    const ms = 1000 - (Date.now() % 1000);
    let interval;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 1000);
    }, ms);
    return () => { clearTimeout(timeout); if (interval) clearInterval(interval); };
  }, []);
  return now;
}

function ClockPanel() {
  const now = useLiveClock();
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return (
    <div style={{
      ...cardStyle,
      marginBottom: "20px",
      padding: "18px 22px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", gap: "16px", flexWrap: "wrap",
    }}>
      <div>
        <div style={{
          fontSize: "9px", letterSpacing: "0.22em",
          textTransform: "uppercase", color: "var(--ink-soft)",
          fontWeight: 500, marginBottom: "4px",
        }}>Current Time</div>
        <div className="mono" style={{
          fontSize: "38px", fontWeight: 500, lineHeight: 1,
          color: "var(--ink)", letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {hours}<span style={{ color: "var(--ink-faint)" }}>:</span>{mm}
          <span style={{
            color: "var(--ink-faint)", fontSize: "20px",
            marginLeft: "4px", letterSpacing: "0.04em",
          }}>:{ss} {ampm}</span>
        </div>
      </div>
      <AxiumTimer />
    </div>
  );
}

/* ============================================================================
 * AXIUM AUTO-LOGOUT TIMER
 *
 * Optional countdown for the Axium auto-logout duration. Click "Reset" each
 * time you have activity in Axium (open a chart, save a note, etc.) and the
 * countdown restarts from the configured duration. When it reaches zero the
 * display turns oxblood and pulses gently — a visual "Axium just kicked you
 * out, expect to log back in."
 *
 * The timeout duration is configurable via a small "Edit" affordance. Default
 * is 15 minutes, but each institution configures Axium differently — UIC's
 * specific timeout can be set once via the editor and stored in localStorage.
 * ==========================================================================*/
function AxiumTimer() {
  // Read the user's configured duration (in seconds) from localStorage,
  // defaulting to 15 minutes if unset.
  const STORAGE_KEY = "axiumTimerSeconds";
  const DEFAULT_DURATION = 15 * 60;

  const [duration, setDuration] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_DURATION;
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    const n = stored ? parseInt(stored, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_DURATION;
  });
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editMins, setEditMins] = useState(String(Math.round(duration / 60)));

  // Persist duration changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage?.setItem(STORAGE_KEY, String(duration)); } catch {}
  }, [duration]);

  // Tick down each second when running. We use a wall-clock anchor instead
  // of a setInterval counter so background-tab throttling doesn't drift.
  const startedAt = useRef(null);
  useEffect(() => {
    if (!running) return;
    startedAt.current = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, duration]);

  const start = () => { setRunning(true); setRemaining(duration); };
  const stop = () => { setRunning(false); setRemaining(0); };
  const reset = () => { startedAt.current = Date.now(); setRemaining(duration); };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const expired = running && remaining === 0;

  // Edit form for changing the duration.
  if (editing) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 10px", border: "1px solid var(--accent)",
        borderRadius: "2px", background: "var(--paper-soft)",
      }}>
        <input type="number" min="1" max="120" value={editMins}
          onChange={e => setEditMins(e.target.value)}
          style={{
            width: "50px", padding: "4px 6px", fontSize: "13px",
            fontFamily: "'Geist', sans-serif", textAlign: "center",
            border: "1px solid var(--rule)", borderRadius: "2px",
            outline: "none", color: "var(--ink)",
          }} />
        <span style={{ fontSize: "11px", color: "var(--ink-soft)" }}>min</span>
        <button type="button"
          onClick={() => {
            const m = parseInt(editMins, 10);
            if (Number.isFinite(m) && m > 0) {
              setDuration(m * 60);
              if (running) setRemaining(m * 60);
            }
            setEditing(false);
          }}
          style={{
            background: "var(--accent)", color: "var(--paper)",
            border: "none", borderRadius: "2px",
            padding: "4px 10px", fontSize: "10px",
            fontFamily: "'Geist', sans-serif", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer",
          }}>Save</button>
      </div>
    );
  }

  // Idle (timer not running): show the "Start Axium timer" affordance.
  if (!running) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div>
          <div style={{
            fontSize: "9px", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--ink-soft)",
            fontWeight: 500, marginBottom: "4px", textAlign: "right",
          }}>Axium logout</div>
          <button type="button" onClick={start}
            style={{
              background: "transparent",
              border: "1px dashed var(--rule)",
              color: "var(--ink-soft)", borderRadius: "2px",
              padding: "6px 12px", fontSize: "11px",
              fontFamily: "'Geist', sans-serif",
              cursor: "pointer", letterSpacing: "0.04em",
              transition: "border-color 140ms ease, color 140ms ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--rule)";
              e.currentTarget.style.color = "var(--ink-soft)";
            }}>
            Start ({Math.round(duration / 60)} min)
          </button>
        </div>
        <button type="button" onClick={() => { setEditMins(String(Math.round(duration / 60))); setEditing(true); }}
          aria-label="Edit timer duration"
          title="Edit duration"
          style={{
            background: "transparent", border: "none",
            color: "var(--ink-faint)", fontSize: "14px",
            cursor: "pointer", padding: "4px 6px", lineHeight: 1,
            alignSelf: "flex-end",
          }}>⚙</button>
      </div>
    );
  }

  // Running: show the countdown + Reset/Stop buttons.
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "8px 12px", borderRadius: "2px",
      background: expired ? "rgba(122, 30, 30, 0.10)" : "var(--paper-soft)",
      border: `1px solid ${expired ? "var(--accent)" : "var(--rule)"}`,
      animation: expired ? "axiumPulse 1.4s ease-in-out infinite" : "none",
    }}>
      <div>
        <div style={{
          fontSize: "9px", letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: expired ? "var(--accent)" : "var(--ink-soft)",
          fontWeight: 500, marginBottom: "2px",
        }}>{expired ? "Axium expired" : "Axium logout in"}</div>
        <div className="mono" style={{
          fontSize: "20px", fontWeight: 500, lineHeight: 1,
          color: expired ? "var(--accent)" : "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}>{mm}:{ss}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <button type="button" onClick={reset}
          style={{
            background: "var(--accent)", color: "var(--paper)",
            border: "none", borderRadius: "2px",
            padding: "4px 10px", fontSize: "10px",
            fontFamily: "'Geist', sans-serif", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer",
          }}>Reset</button>
        <button type="button" onClick={stop}
          style={{
            background: "transparent", color: "var(--ink-soft)",
            border: "1px solid var(--rule)", borderRadius: "2px",
            padding: "3px 10px", fontSize: "10px",
            fontFamily: "'Geist', sans-serif",
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer",
          }}>Stop</button>
      </div>
    </div>
  );
}

function PrivacyBanner() {
  return (
    <p style={{
      marginTop: "18px", marginBottom: 0,
      fontSize: "11px", lineHeight: 1.6,
      color: "var(--ink-faint)",
      fontStyle: "italic",
    }}>
      Notes and patient fields stay local to your browser — nothing is sent
      or stored anywhere else. Clicking codes copies to clipboard. Don't forget your name.
    </p>
  );
}

const cardStyle = {
  background: "var(--card)",
  border: "1px solid var(--rule)",
  // A whisper of shadow — invisible at first glance, but makes the page feel
  // layered rather than flat-papery. The vertical offset is intentional:
  // page background sits "behind" the cards at a slight angle.
  // A whisper of shadow — invisible at first glance, but makes the page feel
  // layered rather than flat-papery. The vertical offset is intentional:
  // page background sits "behind" the cards at a slight angle.
  boxShadow: "0 1px 2px rgba(26, 22, 18, 0.03), 0 4px 12px rgba(26, 22, 18, 0.025)",
  padding: "22px 22px 14px", borderRadius: "3px",
};
const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" };
const threeCol = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" };
const Hairline = () => <div className="hairline-soft" style={{ margin: "14px 0 16px" }} />;

/* ============================================================================
 * BROWSE
 * ==========================================================================*/
function Browse({
  chunks,
  selectedProcedureId, onSelectProcedure,
  onGenerateNote, onAddToPrepList,
  jumpToId, onJumped,
}) {
  // ─────────────── Selection state ───────────────
  // Local mirrors of section/group selection that are derived from the
  // App-level `selectedProcedureId` whenever it changes.
  const initial = useMemo(() => {
    if (selectedProcedureId) {
      const proc = findProcedure(selectedProcedureId);
      if (proc) return { categoryId: proc.categoryId, groupId: proc.groupId };
    }
    return { categoryId: CATEGORIES[0].id, groupId: CATEGORIES[0].groups[0].id };
  }, [selectedProcedureId]);

  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [groupId, setGroupId] = useState(initial.groupId);
  const [search, setSearch] = useState("");

  // Sync local nav state when the App-level selection changes.
  useEffect(() => {
    if (!selectedProcedureId) return;
    const proc = findProcedure(selectedProcedureId);
    if (proc && (proc.categoryId !== categoryId || proc.groupId !== groupId)) {
      setCategoryId(proc.categoryId);
      setGroupId(proc.groupId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProcedureId]);

  const currentCategory = useMemo(
    () => CATEGORIES.find(c => c.id === categoryId), [categoryId]);
  const currentGroup = useMemo(
    () => currentCategory?.groups.find(g => g.id === groupId), [currentCategory, groupId]);

  // When category changes, default to its first group.
  const handleCategoryChange = (id) => {
    setCategoryId(id);
    const cat = CATEGORIES.find(c => c.id === id);
    const firstGroup = cat?.groups[0];
    if (firstGroup) {
      setGroupId(firstGroup.id);
      // Auto-select first procedure in that group too, so the article view
      // is never empty.
      const firstProc = firstGroup.procedures[0];
      if (firstProc) onSelectProcedure(firstProc.id);
    }
  };

  const handleGroupChange = (id) => {
    setGroupId(id);
    const grp = currentCategory?.groups.find(g => g.id === id);
    const firstProc = grp?.procedures[0];
    if (firstProc) onSelectProcedure(firstProc.id);
  };

  // The currently displayed procedure (may be null if none selected).
  const currentProcedure = useMemo(
    () => findProcedure(selectedProcedureId), [selectedProcedureId]);

  // The "steps" chunk for the current procedure (with fallback to the main
  // entry chunk when no separate steps chunk exists).
  const stepsChunk = useMemo(
    () => findChunkForProcedure(currentProcedure, chunks, "steps"),
    [currentProcedure, chunks]);

  // Strip any "note template" section that was bundled into the same chunk
  // body as the steps. The Swade PDF sometimes runs them together; we have
  // a dedicated Note Builder for that content.
  // Also strips a redundant leading title line like "implant consult: steps"
  // since the h2 heading already names the procedure.
  // Returns null when nothing remains after stripping (chunk was purely a
  // note template), which causes the "no steps" fallback to render instead.
  const stepsBody = useMemo(() => {
    if (!stepsChunk) return null;
    let body = stepsChunk.body;
    // Strip note template section (mid-body or leading).
    const m = body.match(/(^|\n)[^\n]*note template/i);
    body = m ? body.slice(0, m.index).trimEnd() : body;
    // Strip leading "<procedure>: steps/instructions/equipment" title line.
    body = body.replace(/^[^\n]+:\s+(?:steps|instructions|equipment)\n+/i, "");
    return body.trim() || null;
  }, [stepsChunk]);

  // ─────────────── External cite-jump (unchanged behavior) ───────────────
  const articleRef = useRef(null);
  useEffect(() => {
    if (!jumpToId) return;
    const target = chunks.find(c => c.id === jumpToId);
    if (target) {
      // For citation jumps, find the procedure whose role-chunks include the
      // target, and select it; otherwise just leave the user where they are.
      // Simple fallback: scroll to top of article.
      articleRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
    onJumped && onJumped();
  }, [jumpToId, onJumped, chunks]);

  // ─────────────── Search across all procedures ───────────────
  // Search matches procedure labels (from breadcrumbs) AND chunk bodies.
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    for (const p of ALL_PROCEDURES) {
      const inLabel = p.breadcrumb.toLowerCase().includes(q);
      const stepChunk = findChunkForProcedure(p, chunks, "steps");
      const inSteps = stepChunk && stepChunk.body.toLowerCase().includes(q);
      if (inLabel || inSteps) {
        results.push({ procedure: p, matchedIn: inLabel ? "label" : "steps" });
      }
    }
    return results;
  }, [search, chunks]);

  // ─────────────── Render ───────────────
  return (
    <div className="layout" style={{
      display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr",
      gap: "44px", alignItems: "start",
    }}>
      {/* Left: navigation */}
      <section>
        <div style={cardStyle}>
          <Field label="Section">
            <Select value={categoryId} onChange={handleCategoryChange} prominent>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
          </Field>
          {currentCategory && currentCategory.groups.length > 1 && (
            <Field label="Group">
              <Select value={groupId} onChange={handleGroupChange} prominent>
                {currentCategory.groups.map(g => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Procedure">
            <Select value={selectedProcedureId}
              onChange={onSelectProcedure} prominent>
              <option value="">— Select a procedure —</option>
              {(currentGroup?.procedures || []).map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Search card */}
        <div style={{ ...cardStyle, marginTop: "20px" }}>
          <label style={labelStyle}>Search</label>
          <input type="text" placeholder="e.g. cold test, Vitrebond, RCT"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, fontSize: "13px",
              background: "var(--paper-soft)" }} />
          {search.trim() && (
            <div style={{ marginTop: "10px", fontSize: "11px",
                color: "var(--ink-soft)", letterSpacing: "0.04em" }}>
              {searchResults?.length ?? 0} match{(searchResults?.length ?? 0) === 1 ? "" : "es"}
            </div>
          )}
          {search.trim() && searchResults && searchResults.length > 0 && (
            <div style={{
              marginTop: "12px", maxHeight: "44vh", overflowY: "auto",
              borderTop: "1px solid var(--rule-soft)", paddingTop: "8px",
            }}>
              {searchResults.map(({ procedure: p }) => {
                const active = p.id === selectedProcedureId;
                return (
                  <div key={p.id}
                    onClick={() => {
                      onSelectProcedure(p.id);
                      setCategoryId(p.categoryId);
                      setGroupId(p.groupId);
                      setSearch("");
                    }}
                    style={{
                      padding: "8px 10px", fontSize: "12px",
                      cursor: "pointer", borderRadius: "2px",
                      color: active ? "var(--paper)" : "var(--ink)",
                      background: active ? "var(--accent)" : "transparent",
                      lineHeight: 1.4,
                      transition: "background 100ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "var(--paper-soft)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}>
                    <div style={{
                      fontSize: "9px", letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: active ? "rgba(250, 246, 237, 0.65)" : "var(--ink-soft)",
                      marginBottom: "2px",
                    }}>{p.categoryLabel} / {p.groupLabel}</div>
                    {p.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Right: steps + actions */}
      <div style={{ position: "relative" }}>
        {currentProcedure && stepsBody && (
          <div style={{
            position: "absolute", top: "-19px", right: "1px",
            fontSize: "11px", color: "var(--ink-faint)",
            fontFamily: "'Geist', sans-serif", lineHeight: 1,
          }}>
            Steps from <em className="serif" style={{ fontStyle: "italic" }}>(swade)</em>
          </div>
        )}
      <article ref={articleRef} style={{
        background: "var(--paper)", border: "1px solid var(--rule)",
        borderRadius: "3px", padding: "32px 36px",
        maxHeight: "78vh", overflowY: "auto",
        textAlign: "left",
      }}>
        {currentProcedure ? (
          <>
            <h2 className="serif" style={{
              fontSize: "30px", margin: "0 0 24px", fontWeight: 400,
              letterSpacing: "-0.01em", lineHeight: 1.15,
            }}>{currentProcedure.label}</h2>
            <div className="hairline" style={{ margin: "0 0 22px" }} />

            {stepsBody ? (
              <ProseBlock text={stepsBody} highlight={search} />
            ) : (
              <div style={{
                color: "var(--ink-faint)", fontStyle: "italic",
                fontSize: "13px", padding: "20px 0",
              }}>
                Sarah Swade&apos;s guide doesn&apos;t include a structured steps
                section for this procedure. The Note Builder still has its
                template, and the Class Notebook (Ask) can answer questions
                about it.
              </div>
            )}

            {/* Action row at the bottom of the steps view */}
            <div className="hairline" style={{ margin: "32px 0 22px" }} />
            <div style={{
              display: "flex", gap: "10px", flexWrap: "wrap",
            }}>
              <button className="primary"
                onClick={() => onGenerateNote(currentProcedure.id)}>
                Generate Note  →
              </button>
              <button className="ghost"
                onClick={() => onAddToPrepList(currentProcedure.id)}>
                Add to Prep List  →
              </button>
            </div>
          </>
        ) : (
          <div style={{
            color: "var(--ink-faint)", fontStyle: "italic",
            fontSize: "13px", padding: "20px 0",
          }}>
            Select a procedure on the left to view its steps.
          </div>
        )}
      </article>
      </div>
    </div>
  );
}

/* ============================================================================
 * PREP LIST  —  morning-of equipment prep for the day's procedures.
 *
 * Why this exists (and why it isn't a step-by-step walkthrough):
 *   The Browse tab already shows the full guide, so a per-procedure
 *   walkthrough is mostly a re-skin of Browse. What students actually need
 *   that no other tab provides is help in the LOCKER, before clinic, when
 *   you have a list of patients on the schedule and you're trying to figure
 *   out what to grab from sterilization. This tab takes a list of today's
 *   procedures and produces one consolidated, deduplicated checklist
 *   organized by where you pick the equipment up.
 * ==========================================================================*/

// Find a chunk by procedure breadcrumb + chunk role (e.g. "steps", "equipment").
// Uses the procedure's group label + procedure label as keyword sources, and
// is peds-aware so we don't conflate "Peds Composite Class II" with the adult
// version of the same procedure.
//
// If no role-specific chunk exists (e.g. Prophy doesn't have a separate
// "prophy: steps" chunk because its steps are baked into the main entry),
// fall back to the best-matching chunk WITHOUT the role filter so the user
// still sees something useful — UNLESS the caller passes `noFallback: true`,
// which is appropriate for equipment lookup (where falling back would parse
// a steps chunk as equipment and produce garbage items).
function findChunkForProcedure(procedure, chunks, role, opts = {}) {
  if (!procedure) return null;
  const noFallback = opts.noFallback === true;
  const isPedsCategory = procedure.categoryId === "peds";
  const text = `${procedure.groupLabel} ${procedure.label}`.toLowerCase();
  const keywords = text
    .replace(/[—–-]/g, " ")
    .split(/\s+/)
    .map(w => w.replace(/[():]/g, ""))
    .filter(w => w.length >= 2 && !["the", "and", "for", "of", "in"].includes(w));

  const search = (requireRole) => {
    let best = null;
    let bestScore = 0;
    for (const c of chunks) {
      const t = c.title.toLowerCase();
      if (requireRole && !t.includes(role)) continue;
      const isPedsChunk = c.section === "PEDS";
      if (isPedsChunk !== isPedsCategory) continue;
      const overlap = keywords.filter(w => t.includes(w)).length;
      if (overlap > bestScore) { bestScore = overlap; best = c; }
    }
    return best;
  };

  const exact = search(true);
  if (exact) return exact;
  return noFallback ? null : search(false);
}

// Parse one equipment chunk into { sterilization, locker, clinic, unit, other }.
// Equipment lines look like:
//   "●​ from sterilization: exam kit, …"  (top-level group)
//   "    ○​ in case crown doesn't fit, also get: PVS gun (2), …"  (sub-group)
// Continuation lines wrap mid-list. We need to:
//   1. Treat each ●-bullet as a new top-level group.
//   2. Treat each ○-bullet as a continuation of its parent group (so
//      "if crown doesn't fit" items still go in "from sterilization"),
//      but as a SEPARATE list segment so its first item doesn't get
//      concatenated onto the last item of the parent.
//   3. Drop the leading qualifier ("in case crown doesn't fit, also get:")
//      so we just keep the actual items.
function parseEquipment(chunk) {
  if (!chunk) return null;
  const groups = { sterilization: [], locker: [], clinic: [], unit: [], other: [] };

  // Skip the title line; collapse continuation whitespace within each line
  // but preserve the ●/○ markers as boundaries.
  const body = chunk.body.split("\n").slice(1).join(" ");

  // Walk through, splitting on ● first.
  // The zero-width-space (\u200b) often follows the bullet glyphs.
  const topBullets = body.split(/●\u200b?/).map(s => s.trim()).filter(Boolean);

  for (const top of topBullets) {
    // Within a top bullet, split off any ○-introduced sub-bullets.
    const segments = top.split(/○\u200b?/).map(s => s.trim()).filter(Boolean);
    if (segments.length === 0) continue;

    // First segment carries the group label "from sterilization: …"
    const firstSeg = segments[0];
    const m = firstSeg.match(/^(?:from\s+)?([a-z][a-z\s/]*?):\s*(.+)$/i);
    if (!m) continue;
    const rawKey = m[1].toLowerCase().trim();
    const groupKey =
      rawKey.includes("steril") ? "sterilization" :
      rawKey.includes("locker") ? "locker" :
      rawKey.includes("unit")   ? "unit" :
      rawKey.includes("clinic") ? "clinic" :
      "other";

    const splitItems = (s) =>
      s.split(/,(?![^(]*\))/)        // commas not inside parens
       .map(x => x.replace(/\s+/g, " ").trim())   // collapse multi-space
       .filter(Boolean);

    // Items from the first segment (drop the "label:" prefix).
    for (const item of splitItems(m[2])) groups[groupKey].push(item);

    // Each ○ sub-bullet typically starts with a qualifier like
    // "in case crown doesn't fit, also get: …" — strip that prefix so
    // we just collect the actual items.
    for (const sub of segments.slice(1)) {
      // Find the colon that ends the qualifier and keep what follows.
      const colonIdx = sub.indexOf(":");
      const items = colonIdx >= 0 ? sub.slice(colonIdx + 1).trim() : sub;
      for (const item of splitItems(items)) groups[groupKey].push(item);
    }
  }

  return groups;
}

// Merge equipment from multiple procedures, deduplicating by lowercased text.
function mergeEquipment(perProc) {
  const merged = { sterilization: new Map(), locker: new Map(),
                   clinic: new Map(), unit: new Map(), other: new Map() };
  for (const { label, groups } of perProc) {
    if (!groups) continue;
    for (const k of Object.keys(merged)) {
      for (const item of groups[k]) {
        const key = item.toLowerCase();
        if (!merged[k].has(key)) merged[k].set(key, { text: item, sources: [] });
        merged[k].get(key).sources.push(label);
      }
    }
  }
  // Convert to plain arrays, sorted alphabetically.
  const out = {};
  for (const k of Object.keys(merged)) {
    out[k] = [...merged[k].values()].sort((a, b) =>
      a.text.localeCompare(b.text, undefined, { sensitivity: "base" }));
  }
  return out;
}

/* ============================================================================
 * RVUs TAB
 *
 * 704 procedure codes from UIC's RVU sheet, organized for quick lookup and
 * "what should I focus on" planning. Three lenses:
 *
 *   1. Filter by category (Restorative, Endo, Fixed, etc.) — pill row above
 *      the table. Categories are derived from the standard CDT code prefix
 *      convention (D2xxx = Restorative, D3xxx = Endo, ...) plus UIC-specific
 *      prefixes for digital workflow steps and educational activities.
 *
 *   2. Search by code or description.
 *
 *   3. Optional target RVU input — when set, an extra column shows how many
 *      of each procedure would hit that target ("Need" column). Lets students
 *      see "okay, 20 crowns OR 4 endos OR 50 prophies = my goal."
 *
 * The header strip shows live stats for whatever filter is active. Codes
 * referenced anywhere in the Swade guide are marked with an oxblood dot
 * since those are the procedures students actually do most often.
 * ==========================================================================*/

// Build a one-time set of every code referenced anywhere in TEMPLATES or
// CHUNKS, used to mark "Swade-relevant" rows. Computed once at module load.
const SWADE_CODES = (() => {
  const text = Object.values(TEMPLATES).join("\n") +
               "\n" + CHUNKS.map(c => c.body).join("\n");
  const matches = text.match(/D\d{4}[A-Z]?(?:\.\d)?/g) || [];
  return new Set(matches);
})();

// CDT category convention by code prefix. Used by the code lookup table
// for quick filtering.
const RVU_CATEGORIES = [
  { id: "all",   label: "All",            match: () => true },
  { id: "diag",  label: "Diagnostic",     match: c => /^D0/.test(c) },
  { id: "prev",  label: "Preventive",     match: c => /^D1/.test(c) },
  { id: "rest",  label: "Restorative",    match: c => /^D2/.test(c) },
  { id: "endo",  label: "Endo",           match: c => /^D3/.test(c) },
  { id: "perio", label: "Perio",          match: c => /^D4/.test(c) },
  { id: "rpd",   label: "Removable",      match: c => /^D5/.test(c) },
  { id: "fix",   label: "Fixed/Implant",  match: c => /^D6/.test(c) },
  { id: "os",    label: "Oral Surgery",   match: c => /^D7/.test(c) },
  { id: "ortho", label: "Orthodontics",   match: c => /^D8/.test(c) },
  { id: "adj",   label: "Adjunctive",     match: c => /^D9/.test(c) },
  { id: "dig",   label: "Digital",        match: c => /^DD/.test(c) || /^RD/.test(c) },
  { id: "edu",   label: "IPE / Other",    match: c => /^I/.test(c) || /^R9/.test(c) || /^R5/.test(c) },
];

// MEE category structure mapping the UIC dashboard's 14 progress columns
// to D3/D4 thresholds and the CDT codes that count toward each category.
// Source: DAOB 333 Spring 2026 syllabus + UIC Student Dashboard reports.
//
// Each category has:
//   - dashKey: short label as it appears in the dashboard (used for the
//     input form so layout mirrors the dashboard order)
//   - d3 / d4: MEE threshold counts. A student is "at D3 level" when their
//     count >= d3, "at D4 level" when count >= d4. Below d3 is pink in the
//     dashboard, between d3 and d4 is yellow, at or above d4 is white.
//   - codeMatcher: returns true for any code that counts toward this
//     category. Used to surface "which procedures will close my gap?"
//   - notes: rendered as a small italic disclosure when the gap is shown,
//     for any UIC-specific rules (n=3 indirect rule, etc.)
const MEE_CATEGORIES = [
  {
    id: "diagnostic",
    dashKey: "Diagnostic",
    d3: 400, d4: 600,
    codeMatcher: c => /^D0(120|140|147|150|160)/.test(c),
  },
  {
    id: "prevention",
    dashKey: "Prevention",
    d3: 200, d4: 280,
    codeMatcher: c => /^D1(110|120|206|208|310|320|330|351|354)/.test(c),
  },
  {
    id: "directRest",
    dashKey: "Direct Rest",
    d3: 172, d4: 318,
    // Amalgam D2140-D2161, composite D2330-D2394, core buildup D2950
    codeMatcher: c => /^D21[456]/.test(c) || /^D23[3-9]/.test(c) || /^D2950/.test(c),
  },
  {
    id: "indirectRestSU",
    dashKey: "InDirect Rest SU",
    d3: 30, d4: 200,
    // Conventional crowns D2740/D2750/D2790 + digital DD2610/DD2620/DD2630/
    // DD2642/DD2643/DD2644/DD2740
    codeMatcher: c => /^D27(40|50|90)/.test(c) || /^DD27(40|10|20|30|42|43|44)/.test(c),
    notes: "n=3 from DD codes or D2740. Class of 2026: at least 2 must be partial coverage (inlays/onlays).",
  },
  {
    id: "endo",
    dashKey: "Endo",
    d3: 12, d4: 35,
    // D3220 pulpotomy + D3310/D3320/D3330 with A/B suffixes
    codeMatcher: c => /^D33[123]0[AB]?$/.test(c) || /^D3220/.test(c),
  },
  {
    id: "perio",
    dashKey: "Perio",
    d3: 220, d4: 380,
    codeMatcher: c => /^D4(341|342|346|910)/.test(c),
  },
  {
    id: "completeDent",
    dashKey: "Complete Dent",
    d3: 25, d4: 116,
    // D5110/D5120 with A/B/C suffixes
    codeMatcher: c => /^D51[12]0[ABC]?$/.test(c),
  },
  {
    id: "partialDent",
    dashKey: "Partial Dent",
    d3: 5, d4: 70,
    codeMatcher: c => /^D52(11|12|13|14)/.test(c),
    notes: "n=1 mandatory: at least one D5213 or D5214 delivery to graduate.",
  },
  {
    id: "fdpImplants",
    dashKey: "FDP/Implants",
    d3: 5, d4: 30,
    // FPD pontics D6210-D6252, retainers D6740-D6792, implant codes
    // D6058-D6077 and DD6058
    codeMatcher: c =>
      /^D6(2[1-5]|7[4-9]|9[2])/.test(c) ||
      /^D60(5[89]|6[0-9]|7[0-7])/.test(c) ||
      /^DD60(58|65)/.test(c),
    notes: "n=1 mandatory: at least one implant-related procedure.",
  },
  {
    id: "os",
    dashKey: "OS",
    d3: 155, d4: 170,
    // Routine extractions D7111/D7140, surgical D7210-D7250
    codeMatcher: c => /^D71(11|40)/.test(c) || /^D72[1-5]0/.test(c),
  },
  {
    id: "ortho",
    dashKey: "Ortho",
    d3: 10, d4: 10,
    codeMatcher: c => /^D8(010|020|030|090|670)/.test(c),
  },
  {
    id: "phase12",
    dashKey: "Phase I,II ReEval",
    d3: 5, d4: 10,
    codeMatcher: c => /^D0170/.test(c),
  },
  {
    id: "phase3",
    dashKey: "Phase III ReEval",
    d3: 10, d4: 30,
    codeMatcher: c => /^D0103/.test(c),
  },
  {
    id: "ga",
    dashKey: "GA",
    // No published threshold for GA — included for completeness so the
    // student can see their count next to the others, but no gap math.
    d3: null, d4: null,
    codeMatcher: () => false,
  },
];

const PROGRESS_STORAGE_KEY = "meeProgress";

/* ============================================================================
 * MEE PROGRESS — top of the RVUs tab.
 *
 * Designed to answer one question on first glance: "where am I, and what
 * do I need to do?" Layout:
 *
 *   - VERDICT (always visible if data entered): single sentence summary —
 *     how many categories below D3, how many RVUs left to D4 across all.
 *
 *   - ACTION ITEMS: only categories where the student is below D4. Sorted
 *     biggest gap first. Each row shows current/D3/D4, gap, progress bar,
 *     and the top few high-RVU codes that count toward closing the gap.
 *
 *   - COMPLETED: categories already at D4 collapse to a single line.
 *
 *   - UPDATE FORM (collapsed by default): edit numbers, with +/- buttons
 *     for quick increment after a clinic session.
 * ==========================================================================*/

// Status of a count vs category thresholds.
function MEEProgress() {
  // Removed entirely — the code lookup table is self-explanatory.
  return null;
}

function RVUs() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortDir, setSortDir] = useState("asc");
  // Hide codes that aren't referenced in the Swade manual. The full table is
  // exhaustive (every CDT code) and most students only ever use the subset
  // Swade documented; this toggle cuts noise without losing the option to
  // browse everything.
  const [swadeOnly, setSwadeOnly] = useState(true);

  // Apply category filter + Swade filter + search filter, then sort.
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cat = RVU_CATEGORIES.find(c => c.id === activeCategory);
    let filtered = RVU_DATA.filter(r => cat ? cat.match(r.code) : true);
    if (swadeOnly) {
      filtered = filtered.filter(r => SWADE_CODES.has(r.code));
    }
    if (q) {
      filtered = filtered.filter(r =>
        r.code.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q));
    }
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "relevance") {
        const aRel = SWADE_CODES.has(a.code) ? 1 : 0;
        const bRel = SWADE_CODES.has(b.code) ? 1 : 0;
        cmp = bRel - aRel;
        if (cmp === 0) cmp = a.code.localeCompare(b.code);
      } else if (sortBy === "code") {
        cmp = a.code.localeCompare(b.code);
      } else if (sortBy === "desc") {
        cmp = a.desc.localeCompare(b.desc);
      } else if (sortBy === "rvu") {
        cmp = (a.rvu || 0) - (b.rvu || 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [search, sortBy, sortDir, activeCategory, swadeOnly]);

  // Stats summary for the current filter.
  const stats = useMemo(() => {
    const rvus = rows.map(r => r.rvu).filter(v => v > 0);
    const total = rvus.length;
    const avg = total ? (rvus.reduce((a, b) => a + b, 0) / total) : 0;
    const max = total ? Math.max(...rvus) : 0;
    return { count: rows.length, valued: total, avg, max };
  }, [rows]);

  // Per-category counts for the pill row.
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of RVU_CATEGORIES) {
      let filtered = RVU_DATA.filter(r => cat.match(r.code));
      if (swadeOnly) {
        filtered = filtered.filter(r => SWADE_CODES.has(r.code));
      }
      counts[cat.id] = filtered.length;
    }
    return counts;
  }, [swadeOnly]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "rvu" ? "desc" : "asc");
    }
  };

  const sortIndicator = (col) =>
    sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "";

  const headerInput = {
    ...inputStyle,
    fontSize: "13px", padding: "8px 11px",
  };

  return (
    <div>
      {/* Primary: progress tracker */}
      <MEEProgress />

      {/* Code lookup table */}
      <div>
        {/* Search input */}
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Search code or description</label>
          <input type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="e.g. crown, D2740, prophy"
            style={headerInput} />
        </div>

        {/* Swade-only toggle — hides the long tail of CDT codes the manual
            doesn't mention so the table reads like the codes everyone uses. */}
        <label style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          fontSize: "11px", color: "var(--ink-soft)",
          marginBottom: "16px", cursor: "pointer",
          fontFamily: "'Geist', sans-serif",
          userSelect: "none",
        }}>
          <input type="checkbox" checked={swadeOnly}
            onChange={e => setSwadeOnly(e.target.checked)}
            style={{ accentColor: "var(--accent)", cursor: "pointer" }} />
          Hide codes not in <em className="serif" style={{ fontStyle: "italic" }}>(swade)</em> manual
        </label>

        {/* Category filter pills */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "6px",
          marginBottom: "16px",
        }}>
          {RVU_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id];
            return (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontSize: "11px",
                  padding: "5px 11px",
                  borderRadius: "999px",
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: isActive ? 500 : 400,
                  cursor: "pointer",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--rule)"}`,
                  background: isActive ? "var(--accent)" : "var(--paper)",
                  color: isActive ? "var(--paper)" : "var(--ink-soft)",
                  letterSpacing: "0.02em",
                  transition: "all 140ms ease",
                }}>
                {cat.label}
                <span style={{
                  marginLeft: "6px", opacity: 0.7,
                  fontVariantNumeric: "tabular-nums",
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 50px",
            gap: "12px",
            fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", fontWeight: 500,
            color: "var(--ink-soft)",
            padding: "12px 18px", borderBottom: "1px solid var(--rule)",
            background: "var(--paper-soft)",
          }}>
            <button onClick={() => toggleSort("desc")} className="rvu-th"
              style={{ textAlign: "left" }}>
              Description {sortIndicator("desc")}
            </button>
            <button onClick={() => toggleSort("code")} className="rvu-th"
              style={{ textAlign: "center" }}>
              Code {sortIndicator("code")}
            </button>
            <button onClick={() => toggleSort("rvu")} className="rvu-th"
              style={{ textAlign: "right" }}>
              RVU {sortIndicator("rvu")}
            </button>
          </div>

          <div style={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}>
            {rows.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center",
                  color: "var(--ink-faint)", fontStyle: "italic" }}>
                No matches.
              </div>
            ) : rows.map(r => {
              const isRelevant = SWADE_CODES.has(r.code);
              return (
                <div key={r.code} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 50px",
                  gap: "12px",
                  fontSize: "13px", lineHeight: 1.45,
                  padding: "10px 18px",
                  borderBottom: "1px solid var(--rule-soft)",
                  alignItems: "center",
                }}>
                  <div style={{ color: "var(--ink)", textAlign: "left" }}>
                    {r.desc}
                  </div>
                  <div className="mono" style={{
                    color: "var(--accent)", fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  }}>
                    {isRelevant && (
                      <span title="Used in the Swade guide" style={{
                        width: "5px", height: "5px", borderRadius: "50%",
                        background: "var(--accent)", display: "inline-block",
                        flexShrink: 0,
                      }} />
                    )}
                    {r.code}
                  </div>
                  <div style={{
                    textAlign: "right", color: "var(--ink-soft)",
                    fontVariantNumeric: "tabular-nums",
                  }}>{r.rvu}</div>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{
          marginTop: "14px", fontSize: "11px",
          color: "var(--ink-faint)", fontStyle: "italic",
          lineHeight: 1.5,
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "var(--accent)", display: "inline-block",
            marginRight: "6px", verticalAlign: "middle",
          }} />
          codes referenced in <em className="serif" style={{ fontStyle: "italic" }}>(swade)</em> manual
        </p>
      </div>
    </div>
  );
}

function PrepList({ chunks, rows, onRowsChange, onJumpTo, onGenerateNote }) {
  const [checked, setChecked] = useState({});

  // Compute next ID lazily from current rows so we don't need separate state.
  const nextRowId = () => rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;

  const updateRow = (id, patch) => {
    onRowsChange(rows.map(r => r.id === id ? { ...r, ...patch } : r));
  };
  const addRow = () => {
    onRowsChange([...rows, { id: nextRowId(), categoryId: "", procedureId: "" }]);
  };
  const removeRow = (id) => {
    onRowsChange(rows.length > 1 ? rows.filter(r => r.id !== id) : rows);
  };

  // For each filled row, compute its equipment groups.
  const perProc = useMemo(() => {
    const out = [];
    for (const r of rows) {
      const proc = findProcedure(r.procedureId);
      if (!proc) continue;
      // Use the breadcrumb-aware matcher (handles peds parity correctly).
      const eq = findChunkForProcedure(proc, chunks, "equipment", { noFallback: true });
      out.push({
        rowId: r.id,
        label: proc.label,
        procedureId: r.procedureId,
        chunkId: eq?.id || null,
        groups: parseEquipment(eq),
      });
    }
    return out;
  }, [rows, chunks]);

  const merged = useMemo(() => mergeEquipment(perProc), [perProc]);

  const toggle = (key) => setChecked(c => ({ ...c, [key]: !c[key] }));

  const totalItems = Object.values(merged).reduce((sum, list) => sum + list.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const groupMeta = {
    sterilization: { label: "From Sterilization", icon: "⚙" },
    locker:        { label: "From Your Locker",   icon: "❏" },
    clinic:        { label: "In Clinic",           icon: "✦" },
    unit:          { label: "In the Unit",         icon: "◐" },
    other:         { label: "Other",                icon: "·" },
  };

  return (
    <div className="layout" style={{
      display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr",
      gap: "44px", alignItems: "start",
    }}>
      {/* ───── Left: today's schedule ───── */}
      <section>
        <div style={cardStyle}>
          {rows.map((r, i) => {
            const cat = FLAT_CATEGORIES.find(c => c.id === r.categoryId);
            return (
              <div key={r.id} style={{
                paddingBottom: "14px", marginBottom: "14px",
                borderBottom: i < rows.length - 1 ? "1px dashed var(--rule-soft)" : "none",
              }}>
                {rows.length > 1 && (
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "8px",
                  }}>
                    <div className="serif" style={{
                      fontSize: "11px", letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "var(--ink-soft)",
                      fontWeight: 500,
                    }}>Patient {i + 1}</div>
                    <button onClick={() => removeRow(r.id)} style={{
                      background: "none", border: "none",
                      color: "var(--ink-faint)", fontSize: "16px",
                      cursor: "pointer", padding: "0 4px", lineHeight: 1,
                    }}>×</button>
                  </div>
                )}
                <Field label="Category">
                  <Select value={r.categoryId}
                    onChange={(v) => updateRow(r.id, { categoryId: v, procedureId: "" })}>
                    <option value="">— Select a category —</option>
                    {FLAT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </Select>
                </Field>
                <Field label="Procedure">
                  <Select value={r.procedureId}
                    onChange={(v) => updateRow(r.id, { procedureId: v })}>
                    <option value="">{cat ? "— Pick a procedure —" : "—"}</option>
                    {cat?.procedures.map(p =>
                      <option key={p.id} value={p.id}>{p.label}</option>)}
                  </Select>
                </Field>
                {r.procedureId && (
                  <button className="ghost" style={{
                    width: "100%", marginTop: "4px", fontSize: "10px",
                    padding: "8px 10px",
                  }}
                  onClick={() => onGenerateNote(r.procedureId)}>
                    Open note for this →
                  </button>
                )}
              </div>
            );
          })}

          <button className="ghost" onClick={addRow}
            style={{ width: "100%", marginTop: "4px" }}>
            + add procedure
          </button>
        </div>
      </section>

      {/* ───── Right: merged equipment list ───── */}
      <section>

        {totalItems === 0 ? null : (
          <>
            {Object.entries(groupMeta).map(([key, meta]) => {
              const items = merged[key];
              if (!items || items.length === 0) return null;
              return (
                <div key={key} style={{
                  background: "var(--paper)", border: "1px solid var(--rule)",
                  borderRadius: "3px", padding: "20px 24px",
                  marginBottom: "16px",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    marginBottom: "14px",
                    paddingBottom: "10px", borderBottom: "1px solid var(--rule-soft)",
                  }}>
                    <span style={{
                      color: "var(--accent)", fontSize: "16px",
                    }}>{meta.icon}</span>
                    <span className="serif" style={{
                      fontSize: "16px", fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}>{meta.label}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: "11px",
                      color: "var(--ink-faint)",
                      letterSpacing: "0.06em",
                    }}>{items.length} item{items.length === 1 ? "" : "s"}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item, i) => {
                      const ckey = `${key}:${item.text.toLowerCase()}`;
                      const isChecked = !!checked[ckey];
                      return (
                        <li key={i} style={{
                          padding: "5px 0",
                          borderBottom: i < items.length - 1 ? "1px solid var(--rule-soft)" : "none",
                        }}>
                          <label style={{
                            display: "flex", alignItems: "flex-start",
                            gap: "12px", cursor: "pointer",
                          }}>
                            <span aria-hidden style={{
                              width: "16px", height: "16px", flexShrink: 0,
                              border: `1.5px solid ${isChecked ? "var(--accent)" : "var(--rule)"}`,
                              background: isChecked ? "var(--accent)" : "transparent",
                              borderRadius: "2px", marginTop: "2px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "var(--paper)", fontSize: "11px",
                              transition: "background 120ms ease, border-color 120ms ease",
                            }}>{isChecked ? "✓" : ""}</span>
                            <input type="checkbox" checked={isChecked}
                              onChange={() => toggle(ckey)}
                              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                            <span style={{
                              flex: 1, fontSize: "14px",
                              color: isChecked ? "var(--ink-faint)" : "var(--ink)",
                              textDecoration: isChecked ? "line-through" : "none",
                              lineHeight: 1.5,
                            }}>
                              {item.text}
                              {item.sources.length > 1 && (
                                <span style={{
                                  marginLeft: "8px", fontSize: "10px",
                                  color: "var(--accent-soft)",
                                  letterSpacing: "0.04em",
                                  textDecoration: "none",
                                }}>×{item.sources.length}</span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            <div style={{
              marginTop: "20px",
              display: "flex", justifyContent: "flex-end", gap: "10px",
            }}>
              <button className="ghost" onClick={() => setChecked({})}>
                Reset checks
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ============================================================================
 * APP SHELL  —  tabs, header, layout
 * ==========================================================================*/
/* ============================================================================
 * PE DATA — 26 Performance Exams from UIC's Master Clinical PE Reference.
 *
 * Each PE has:
 *   id           — short stable ID, used for navigation
 *   code         — official UIC code (PER01, CR2, CRN1, etc.)
 *   name         — human title
 *   part         — which Part of the master doc it belongs to
 *   deadline     — { semester: "D3-spring" | "D3-fall" | etc., text: human label }
 *                  Some PEs have "or earlier" / DAOB course attachments — kept verbatim.
 *   prereq       — human-readable prerequisite text
 *   prereqCheck  — function (counts) → { eligible: bool, gap?: { n, label } }
 *                  Returns null when the prereq doesn't map cleanly to MEE counts
 *                  (e.g. "after Caries Diagnosis PE" — we don't track PE completion)
 *   caseSelect   — case selection criteria
 *   protocol     — protocol / instructions
 *   criteria     — array of { name, excellent, acceptable, notMet } rubric rows
 *                  Some criteria have N/A in middle column — represented as null
 *   criticalDeficiencies — array of strings; each row is one deficiency
 *
 * Order in the SEMESTERS array drives the timeline layout.
 * ==========================================================================*/

const PE_SEMESTERS = [
  { id: "D3-summer", label: "D3 Summer", short: "Summer" },
  { id: "D3-fall",   label: "D3 Fall",   short: "Fall"   },
  { id: "D3-spring", label: "D3 Spring", short: "Spring" },
  { id: "D4-summer", label: "D4 Summer", short: "Summer" },
  { id: "D4-fall",   label: "D4 Fall",   short: "Fall"   },
  { id: "D4-spring", label: "D4 Spring", short: "Spring" },
];

const PE_PARTS = [
  { id: "perio",       label: "Periodontal Exams" },
  { id: "restFound",   label: "Restorative Foundation" },
  { id: "operative",   label: "Operative" },
  { id: "fixedProsth", label: "Fixed Prosthodontics" },
  { id: "removable",   label: "Removable Prosthodontics" },
  { id: "specialty",   label: "Specialty" },
  { id: "rotation",    label: "Rotation-Specific" },
];

// Prereq check helpers — reach into MEE counts (which mirror the dashboard).
// Counts come from the same localStorage keys the RVU tab uses.
const checkCount = (counts, key, n, label) => {
  const cur = parseFloat(counts[key]) || 0;
  if (cur >= n) return { eligible: true };
  return { eligible: false, gap: { n: n - cur, label } };
};

const PES = [
  // ============================ PART 1: PERIO ============================
  {
    id: "PER01", code: "PER01", part: "perio",
    name: "Periodontal Clinical Evaluation",
    deadline: { semester: "D3-spring", text: "Spring D3/AS3 (DAOB 333)" },
    prereq: "3 COE procedures or combination of Periodontal COE + Periodontal Maintenance (incl. perio charting & gingival exam)",
    prereqCheck: null, // mixed prereq, can't auto-check cleanly
    caseSelect: "Periodontitis patient, at least Stage I, ADA class II (mild). Minimum 16 teeth, at least 2 molars.",
    protocol: "Only Periodontal faculty proctor. Once announced, intention cannot change. Inform faculty before start; no faculty assistance.",
    criteria: [
      { name: "History (Med, Den, Family, Social)",
        excellent: "Complete, accurate and current.",
        acceptable: "Incomplete, missing information, but not critical to wellbeing of the patient.",
        notMet: "Did not recognize conditions which could threaten the life and wellbeing of the patient." },
      { name: "Basic & Clinical Science Correlation",
        excellent: "Accurate correlation of disease process with clinical findings. Able to answer relevant questions adequately.",
        acceptable: "Inaccuracies in correlating disease process with clinical findings but able to provide a satisfactory answer.",
        notMet: "Significant inaccuracies in correlating disease process with clinical findings; unable to provide satisfactory answer." },
      { name: "Probing Depth Measurements",
        excellent: "Probing depths within 1mm of instructor.",
        acceptable: "Probing depths of 2mm in more than three areas.",
        notMet: "Clinically significant differences in probing depths." },
      { name: "Attachment Levels/Loss",
        excellent: "Able to accurately define attachment level/loss.",
        acceptable: null,
        notMet: "Unable to recognize and define attachment level/loss." },
      { name: "Mobility",
        excellent: "Able to describe Miller's mobility index and apply it clinically.",
        acceptable: "Identified some but not all mobile teeth.",
        notMet: "Not able to describe Miller's mobility index; did not recognize significant mobility." },
      { name: "Furcation Probing",
        excellent: "Accurately identifies furcations using the Nabers probe.",
        acceptable: "Assessed but not identified all.",
        notMet: "Did not assess furcations." },
      { name: "Gingival Evaluation",
        excellent: "Accurately evaluates gingival appearance (color, contour, consistency, texture).",
        acceptable: null,
        notMet: "Is not able to distinguish between healthy and diseased gingivae." },
      { name: "Free Gingival Margin (Recession)",
        excellent: "Accurately measures recession of teeth within 1 mm of instructor.",
        acceptable: "Missed some and not all recession or gingival margin above CEJ charted.",
        notMet: "Inaccurately measures recession of more than 2 mm of instructor." },
      { name: "Bleeding Points",
        excellent: "Recognized significance BOP.",
        acceptable: null,
        notMet: "Did not chart and recognize significance BOP." },
      { name: "Radiographic Interpretation",
        excellent: "Able to identify bone loss, furcation radiolucency, and widened PDL space.",
        acceptable: "Identified some areas bone loss, furcation radiolucency and widened PDL space.",
        notMet: "Did not recognize and chart identified areas bone loss, furcation radiolucency and widened PDL space." },
    ],
    criticalDeficiencies: [
      "Case Selection — selection of a case not suitable for a PE.",
      "Professionalism — any violation of professionalism standards.",
      "Patient Management/Infection Control — failure to uphold protocols or protect safety.",
      "Time Management — exam must end no later than scheduled end of clinic session.",
      "Preparedness/Cleanliness — disorganized operatory or inability to answer faculty questions.",
      "Instructor Intervention Required — faculty must intervene to complete the procedure.",
    ],
  },
  {
    id: "PER02", code: "PER02", part: "perio",
    name: "Periodontal Prevention & Risk Factor (OHI) Exam",
    deadline: { semester: "D3-summer", text: "Summer D3 (DMD) / Fall AS3 (DMD-AS)" },
    prereq: "3 OHI procedures including O'Leary Plaque Index",
    prereqCheck: null,
    caseSelect: "Any patient requiring oral hygiene instructions.",
    protocol: "With periodontal instructor present, use disclosing material to assess and document plaque index in axiUm. Perform plaque control instructions tailored to patient using typodont and handheld mirror intraorally.",
    criteria: [
      { name: "Basic & Clinical Science Correlation",
        excellent: "Accurate correlation of disease process with clinical findings. Able to answer relevant questions adequately.",
        acceptable: "Inaccuracies in correlating disease process but able to provide a satisfactory answer.",
        notMet: "Significant inaccuracies; unable to provide satisfactory answer." },
      { name: "Plaque Index",
        excellent: "Accurately documented and understands the relevance of PI.",
        acceptable: "Accurately documented but did not understand the relevance.",
        notMet: "Not completed and recorded." },
      { name: "OHI",
        excellent: "Effective brushing/flossing demonstration; adjusted OHI to patient needs using typodont and mirror.",
        acceptable: "Did not take proper time/effort to explain OHI; used typodont/mirror to demonstrate intraorally.",
        notMet: "Incorrect technique and failed to recognize patient needs. Did not use typodont or mirror intraorally." },
      { name: "Communication of Risk Factors",
        excellent: "Risk factors identified, discussed with patient, and recorded in axiUm.",
        acceptable: "Risk factors not completely discussed and not recorded or updated in axiUm.",
        notMet: "Risk factors for periodontal disease not recognized at all." },
      { name: "Tobacco Cessation",
        excellent: "Located in intranet and discussed as needed with the patient.",
        acceptable: "Located in intranet but unable to discuss with patient.",
        notMet: "Unable to locate in intranet; omitted discussion with the patient." },
      { name: "Patient Management",
        excellent: "Patient rapport established; patient understands importance of OH for long-term health.",
        acceptable: null,
        notMet: "Did not establish patient rapport; patient not informed of long-term goals of prevention." },
    ],
    criticalDeficiencies: ["Standard six (Case Selection, Professionalism, Patient Management/Infection Control, Time Management, Preparedness/Cleanliness, Instructor Intervention)"],
  },
  {
    id: "SRP04", code: "SRP04", part: "perio",
    name: "Calculus Detection & Scaling/Root Planing",
    deadline: { semester: "D4-spring", text: "End of spring D4/AS4 (DAOB 343); can be earlier" },
    prereq: "10 SRP procedures (perio maintenance patients NOT accepted)",
    prereqCheck: (counts) => {
      // SRP procedures fall under Perio MEE category. The dashboard combines
      // SRP + maintenance under "perio" — we can't distinguish them in the
      // count, so we use perio count as a proxy and flag the caveat in the
      // prereq text. Conservative: only show "Eligible" when count is high
      // enough that even with maintenance mixed in, 10 SRPs is plausible.
      const cur = parseFloat(counts["perio"]) || 0;
      if (cur >= 10) return { eligible: true };
      return { eligible: false, gap: { n: 10 - cur, label: "perio procedures" } };
    },
    caseSelect: "One quadrant with attachment loss (D4341); ≥3 probing depths ≥5mm; quadrant must include 3 posterior teeth (including one molar in contact); 12+ surfaces of explorer-detectable subgingival calculus; max 4 surfaces on incisors.",
    protocol: "Once announced, cannot change. No faculty assistance. Instructor checks calculus detection first, then you proceed with removal on ALL surfaces.",
    criteria: [
      { name: "Science Correlation",
        excellent: "Accurate correlation of disease process with findings. Able to answer relevant questions.",
        acceptable: "Inaccuracies in correlating disease process but able to provide satisfactory answer.",
        notMet: "Significant inaccuracies; unable to provide satisfactory answer." },
      { name: "Pre-Tx Calculus Detection",
        excellent: "Accurately detected calculus.",
        acceptable: "3 or fewer errors in calculus detection.",
        notMet: "4 or more errors in calculus detection." },
      { name: "Post-Tx Removal & Root Planing",
        excellent: "All root surfaces are smooth.",
        acceptable: "3 or fewer surfaces of calculus remaining; roots are smooth.",
        notMet: "4 or more surfaces of calculus; rough root surfaces." },
      { name: "Soft Tissue Management",
        excellent: "No soft tissue trauma.",
        acceptable: "2 areas of soft tissue trauma.",
        notMet: "Severe tissue damage, or 3 or more areas of minor tissue damage." },
      { name: "Patient Management",
        excellent: "Established good rapport; provides post-op instructions.",
        acceptable: null,
        notMet: "Very distressed patient. Student ignored discomfort and did not provide post-op instructions." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "MAINT04", code: "MAINT04", part: "perio",
    name: "Periodontal Maintenance Exam",
    deadline: { semester: "D4-spring", text: "End of spring D4/AS4" },
    prereq: "4 periodontal maintenance procedures",
    prereqCheck: null, // perio maintenance not separately tracked from SRP in MEE
    caseSelect: "At least ADA case type II; minimum 12 teeth (anterior, premolar, molar). Phase 1 and Phase 1 re-eval MUST be completed.",
    protocol: "Standard maintenance procedures with full charting required for this PE specifically.",
    criteria: [
      { name: "Science Correlation",
        excellent: "Accurate correlation of disease process with findings. Able to answer relevant questions.",
        acceptable: "Inaccuracies but able to provide satisfactory answer.",
        notMet: "Significant inaccuracies; unable to provide satisfactory answer." },
      { name: "Significance of Findings & Referral",
        excellent: "Adequate TX plan based on findings, including referral, rationale, and next interval.",
        acceptable: null,
        notMet: "Inadequate TX plan; need for referral not recognized; unable to discuss rationale or interval." },
      { name: "Calculus and Plaque Removal",
        excellent: "Effective calculus and plaque removal.",
        acceptable: "2 or fewer sites with minor deposits remain.",
        notMet: "Residual plaque and calculus on 3 or more surfaces." },
      { name: "Patient Management",
        excellent: "Established good rapport; provides post-op instructions.",
        acceptable: null,
        notMet: "Very distressed patient. Student ignored discomfort and did not provide post-op instructions." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "REVA04", code: "REVA04", part: "perio",
    name: "Periodontal Re-Evaluation Exam",
    deadline: { semester: "D4-spring", text: "End of spring D4/AS4" },
    prereq: "3 Periodontal Re-evaluation procedures",
    prereqCheck: (counts) => checkCount(counts, "phase12", 3, "perio re-evaluations"),
    caseSelect: "Periodontitis patient, Stage I, ADA II; minimum 16 teeth, 2 must be molars.",
    protocol: "Gather data, complete examination while instructor observes clinical skills. Update perio chart and EPR forms.",
    criteria: [
      { name: "Science Correlation",
        excellent: "Accurate correlation of disease process with findings. Able to answer relevant questions.",
        acceptable: "Inaccuracies but able to provide satisfactory answer.",
        notMet: "Significant inaccuracies; unable to provide satisfactory answer." },
      { name: "Clinical Exam & Interpretation",
        excellent: "Accurate documentation of findings; able to compare and interpret initial and re-eval data correctly.",
        acceptable: null,
        notMet: "Clinically significant errors in documentation and unable to interpret data." },
      { name: "Assessment of Findings & Prognosis",
        excellent: "Able to determine changes in TX plan, need for referral, and maintenance interval.",
        acceptable: null,
        notMet: "Needed treatment options not considered; fails to understand significance of current findings." },
      { name: "Patient Management",
        excellent: "Established good rapport; provides post-op instructions.",
        acceptable: null,
        notMet: "Very distressed patient. Student ignored discomfort and did not provide post-op instructions." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 2: RESTORATIVE FOUNDATION ======================
const PES_PART2 = [
  {
    id: "DXTX2", code: "DXTX2", part: "restFound",
    name: "Single Tooth Replacement Dx & Tx Planning",
    deadline: { semester: "D3-spring", text: "After prerequisites met" },
    prereq: "DMD: 1 crown completed. AS: 2 crowns completed.",
    prereqCheck: (counts) => checkCount(counts, "indirectRestSU", 1, "crowns"),
    caseSelect: "Partially edentulous patient in need of a single tooth implant and/or fixed partial denture.",
    protocol: "Declare PE prior to start of COE. COE Initial & Additional Assessments (A & B) completed. TP reviewed with mounted casts in advance. Final assessment given on TP presentation day. Casts mounted on semi-adjustable articulator with facebow. All consults (Implant, OS, Endo, Perio) obtained prior to finalizing TP. Problems List Worksheet completed independently.",
    criteria: [
      { name: "Assessment: Diagnostic Info",
        excellent: "All diagnostic info complete (odontogram, perio chart, radiographs, photos, mounted casts with wax-up of edentulous site).",
        acceptable: "Diagnostic information available but minor features missing.",
        notMet: "Diagnostic information missing/incomplete preventing accurate diagnosis/TP." },
      { name: "Medical History",
        excellent: "Correctly gathered & documented medical history and need for medical consult.",
        acceptable: "Omitted relevant medical history information that will result in no risk to patient's health.",
        notMet: "Failed to recognize significant medical history/risk factors that would place patient at risk." },
      { name: "Risk Factors / Etiology",
        excellent: "Accurate identification of risk factors/etiology.",
        acceptable: "Correctly identified risk factors with minor discrepancies/omissions.",
        notMet: "Failure to identify major risk factors and etiology of disease." },
      { name: "Consultations",
        excellent: "Implant Consult obtained and clearly presented.",
        acceptable: "Implant consult obtained but not completely understood or presented.",
        notMet: "Failure to obtain implant and/or other indicated consults." },
      { name: "Problem List, Diagnoses, & Prognosis",
        excellent: "All problems identified correctly at tooth, arch, and patient level. Diagnoses reflect current oral conditions. Prognosis is accurate and clear.",
        acceptable: "Minor problems unidentified or identified incorrectly. Minor portions of diagnoses inaccurate. Prognosis accurate with minor errors.",
        notMet: "Failure to identify major problems OR Problem List Worksheet not completed. Inaccurate diagnoses. Prognosis incorrect/not clearly stated." },
      { name: "Evidence-Based Treatment Plan",
        excellent: "All problems addressed; appropriate sequencing/phasing; based on best evidence; effectively communicates risks/benefits/alternatives.",
        acceptable: null,
        notMet: "One or more problems not addressed. Phasing/sequencing inappropriate. TP not evidence-based. Fails to communicate TP/risks/benefits/alternatives." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "DXTX3", code: "DXTX3", part: "restFound",
    name: "Multiple Teeth Replacement Dx & Tx Planning",
    deadline: { semester: "D3-spring", text: "No specific deadline; complete when ready" },
    prereq: "None.",
    prereqCheck: () => ({ eligible: true }),
    caseSelect: "Partially edentulous patient in need of a removable partial denture in one or more arches.",
    protocol: "Declare PE prior to COE start. COE Initial & Additional Assessments (A & B) completed. TP reviewed with mounted cast in advance. Casts mounted on semi-adjustable articulator with facebow & surveyed. All consults (OS, Endo, Perio) obtained. Problems List Worksheet & Preliminary Partial Design Form completed independently.",
    criteria: [
      { name: "Assessment: Diagnostic Info",
        excellent: "All diagnostic information complete (odontogram, perio chart, radiographs, photos, mounted casts).",
        acceptable: "Diagnostic information available but minor features missing.",
        notMet: "Diagnostic info missing/incomplete preventing accurate diagnosis/TP." },
      { name: "Necessary Consults",
        excellent: "Necessary consults obtained and clearly presented.",
        acceptable: "Indicated specialty consults obtained but not completely understood or presented.",
        notMet: "Failure to obtain all indicated specialty consults." },
      { name: "Survey and Design",
        excellent: "Properly surveyed cast with partial design outlined. Completed Preliminary Design Form with evidence-based justification.",
        acceptable: "Minor errors in survey or design; justification present but lacks evidence-based rationale.",
        notMet: "Failure to survey cast and provide a preliminary partial design with clear justification." },
      { name: "Medical History, Risk Factors, Problem List, Treatment Plan",
        excellent: "Same standards as DXTX2 above.",
        acceptable: "Same as DXTX2.",
        notMet: "Same as DXTX2." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CARDX", code: "CARDX", part: "restFound",
    name: "Caries Diagnosis & ADA Caries Classification",
    deadline: { semester: "D3-fall", text: "End of Fall D3/A3" },
    prereq: "None — must be completed during the restorative phase of a COE or POE.",
    prereqCheck: () => ({ eligible: true }),
    caseSelect: "Patient with at least one clinically and radiographically identifiable carious lesion.",
    protocol: "Complete during restorative phase of COE or POE. Complete caries risk assessment (D0604) and document (D0601, D0602, D0603). Print and review home instructions with patient. Select one tooth with carious lesion and complete the Caries Diagnosis & Classification Worksheet independently.",
    // Note: CARDX has 2-tier rubric (no Excellent column) — represented with null
    criteria: [
      { name: "Caries Risk Assessment",
        excellent: null,
        acceptable: "Caries risk assessment form properly and thoroughly completed (D0604). Caries risk level properly identified. Evidence-based explanation of patient's risk level.",
        notMet: "Form not completed or missing data affecting overall risk. Caries risk not properly identified or completely inaccurate. No evidence-based explanation." },
      { name: "ADA Classification Criteria Form",
        excellent: null,
        acceptable: "Caries classification criteria form completed appropriately.",
        notMet: "Inappropriate or no completion of criteria form." },
      { name: "Diagnosis & Classification",
        excellent: null,
        acceptable: "Proper final diagnosis & classification of selected tooth.",
        notMet: "Inappropriate or no diagnosis & classification of selected tooth." },
      { name: "Management & Prevention Recommendations",
        excellent: null,
        acceptable: "Appropriate and evidence-based suggested management for selected tooth. Appropriate caries prevention strategy prescribed.",
        notMet: "Inappropriate or no suggested management. Inappropriate or no caries prevention strategy prescribed." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CAREX", code: "CAREX", part: "restFound",
    name: "Caries Excavation",
    deadline: { semester: "D3-spring", text: "End of Spring D3/A3" },
    prereq: "Successful completion of CARDX (Caries Diagnosis & Classification PE)",
    prereqCheck: null, // PE-completion not tracked
    caseSelect: "Patient with occlusal or proximal carious lesion extending 1/3 to 1/2 into dentin (verified radiographically). Tooth must be vital with no periapical pathologies.",
    protocol: "Convenience form adequate to visualize and instrument carious tooth structure. Carious tooth structure removed first by excavating peripheral tooth structure to sound hard dentin (visually stain-free DEJ & healthy enamel). For deepest aspect, acceptable to leave discolored tooth structure firm to spoon excavator. Goal of central caries lesion management: remove 'infected dentin' only, preserve pulp.",
    criteria: [
      { name: "Anesthesia & Isolation",
        excellent: "Local anesthesia achieved; patient comfortable. Rubber dam isolation provides clean, dry, accessible field with no leakage or interference.",
        acceptable: "Local anesthesia not fully achieved and patient slightly uncomfortable. Rubber dam isolation has minor leaks or isolation not ideal but does not compromise outcome.",
        notMet: "Local anesthesia not achieved and patient uncomfortable; instructor intervention needed. Isolation not adequate." },
      { name: "External Form (Convenience)",
        excellent: "All carious occlusal fissures/defects included. External outline appropriately sized for extent of caries and instrumentation.",
        acceptable: "Slight overextension/underextension in occlusal fissures. External outline moderately over/underextended.",
        notMet: "Severe overextension/underextension. External outline severely over/underextended." },
      { name: "Caries Removal at DEJ",
        excellent: "No carious tissue or stain left at DEJ.",
        acceptable: "Minimum area of stain remaining at DEJ in non-critical area.",
        notMet: "Extensive areas of stain remaining at DEJ in critical area. Caries remaining at DEJ." },
      { name: "Caries Removal in Dentin",
        excellent: "No overcutting of healthy dentin. Small amount of carious tissue left in deepest part (OK if identified).",
        acceptable: null,
        notMet: "Moderate amount of carious tissue left in deepest part. Excessive removal of tooth structure or caries in deepest area." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 3: OPERATIVE ======================
const PES_PART3 = [
  {
    id: "CR2", code: "CR2", part: "operative",
    name: "Class II Preparation & Resin Composite Restoration",
    deadline: { semester: "D3-spring", text: "One of CR2/CR3 by end of DAOB 341, the other by end of DAOB 342" },
    prereq: "Caries Diagnosis (CARDX) and Caries Excavation (CAREX) PEs completed.",
    prereqCheck: null,
    caseSelect: "Caries into dentin (D1, D2, D3) verified clinically/radiographically. Restorative site must have proximal contacting tooth and should have opposing tooth. Tooth must be treatment planned for Class II conventional or slot restoration.",
    protocol: "Book chair in axiUm 'Performance Exam' Scheduler in NON-HOME clinic with description 'Class II PE'. Assigned by clinic's CM to calibrated faculty in non-home clinic. Cannot select faculty. Complete tooth preparation first; after assessment by student & faculty + clearance, continue with final restoration. After dismissal, enter procedure code; on faculty swipe, evaluation form appears — change category to 'Class II Restoration'.",
    criteria: [
      { name: "Local Anesthesia & Isolation",
        excellent: "Understands technique and administers local anesthesia. Evaluates patient comfort. Rubber dam present at prep check, no faults, properly inverted to produce seal.",
        acceptable: "Rubber dam has minor tear/leakage/gapping/bunching or alternative isolation with proper rationale.",
        notMet: "Does not understand technique or administer LA appropriately. Not attentive to patient comfort and proceeds without adequate anesthesia. Isolation not adequate." },
      { name: "External Outline Form",
        excellent: "Gingival clearance visually open but <1mm. Outline form appropriate. Isthmus 1-2mm wide, less than 1/3 intercuspal width. Cavosurface margin terminates in sound tooth structure.",
        acceptable: "Gingival clearance 1-2mm. Outline form inappropriately overextended compromising marginal ridge/cusp. Isthmus 1/3 to 1/2 intercuspal width. Cavosurface margin not in sound tooth structure or explorer-penetrable decalcification not penetrating to DEJ.",
        notMet: "Gingival clearance not visually open or >2mm. Outline grossly overextended; cavosurface margin unsupported by dentin. Isthmus >1/2 intercuspal width. Explorer-penetrable decalcified enamel penetrating to DEJ." },
      { name: "Internal Form",
        excellent: "Adequate axial wall and pulpal floor depth. All caries and restorative material removed. Retention (if used) well defined, in dentin, does not undermine enamel. Proximal box walls parallel or convergent occlusally.",
        acceptable: "Axial wall and pulpal floor depth overextended or underextended.",
        notMet: "Axial wall and pulpal floor depth grossly over/underextended. Caries remains or previous restorative material remains (without prior approval). Retention undermines enamel. Proximal walls grossly divergent." },
      { name: "Treatment Management (Prep)",
        excellent: "No iatrogenic damage. Pulpal protection requested when necessary and properly placed OR not needed and not requested.",
        acceptable: "Minor iatrogenic damage (tooth can be smoothed/polished without altering ideal contour and/or contact).",
        notMet: "Gross iatrogenic damage requiring restoration. Unrecognized pulpal exposure. Gross soft tissue damage inconsistent with procedure." },
      { name: "Margin Integrity & Surface Finish",
        excellent: "Marginal excess/deficiency not detectable visually or with explorer. Surface uniformly smooth, free of irregularities. No unwarranted recontouring. Restoration bonded to prepared tooth structure.",
        acceptable: "Slight-moderate marginal excess/deficiency. Surface has slight-moderate irregularities/roughness that is correctable. Minimal unwarranted recontouring.",
        notMet: "Severe marginal excess/deficiency or open margin. Surface grainy/pitted/rough or has voids requiring redo. Gross unwarranted removal of adjacent structure exposing dentin. Restoration debonded/movable." },
      { name: "Contact & Contour",
        excellent: "Contact closed visually and resists passage of floss with no shredding. Contact size, shape, and position appropriate; embrasure forms satisfactory. Contour continuous with tooth form.",
        acceptable: "Contact lighter/tighter than other contacts or floss shreds slightly. Contact position/size gives some-moderate deviation from normal embrasure form. Contour slightly-moderately inconsistent.",
        notMet: "Contact visually open or so tight floss will not pass. Contour grossly deficient/excessive leading to potential future iatrogenic damage." },
      { name: "Occlusion",
        excellent: "Centric and excursive contacts consistent in size, shape, intensity of remaining teeth.",
        acceptable: "Restoration in hyper-occlusion and requires adjustment.",
        notMet: "Restoration in gross hyper-occlusion; restoration is only point of contact in quadrant." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CR3", code: "CR3", part: "operative",
    name: "Class III Preparation & Resin Composite Restoration",
    deadline: { semester: "D3-spring", text: "One of CR2/CR3 by end of DAOB 341, the other by end of DAOB 342" },
    prereq: "CARDX and CAREX PEs completed.",
    prereqCheck: null,
    caseSelect: "Caries into dentin (D1, D2, D3) verified. Site must have proximal contacting tooth, should have opposing tooth. Treatment planned for Class III restoration.",
    protocol: "Book chair in axiUm 'Performance Exam' Scheduler in NON-HOME clinic with description 'Class III PE'. Assigned to calibrated faculty in non-home clinic. Complete preparation first; after assessment + clearance, continue with final restoration.",
    criteria: [
      { name: "Local Anesthesia & Isolation",
        excellent: "Understands technique and administers LA. Evaluates patient comfort. Rubber dam has no faults and properly inverted to produce seal.",
        acceptable: "Rubber dam has minor tear/leakage/gapping/bunching or alternative isolation with proper rationale.",
        notMet: "Does not understand technique or administer LA appropriately. Isolation not adequate." },
      { name: "External Outline Form",
        excellent: "Incisal extended for adequate outline & convenience form. Facial, lingual, gingival walls extended for proper outline & convenience. Gingival clearance <1.0mm. Cavosurface margins smooth. No unsupported enamel (unless for facial esthetics). No previous restorative material on margins.",
        acceptable: "Incisal slightly-moderately underextended. F/L/gingival walls slightly-moderately over/underextended. Gingival clearance 1-2mm. Cavosurface margins slightly irregular. If bevels present, <1mm. Small area of unsupported enamel not necessary for esthetics.",
        notMet: "Incisal severely overextended or unnecessary removal of contact. Walls severely over/underextended. Gingival clearance >2.0mm. Margin rough/irregular. Bevels >1mm, not uniform, or inappropriate. Large/multiple areas of unsupported enamel. Margins not on sound tooth structure." },
      { name: "Internal Form",
        excellent: "Axial wall has adequate extension for removal. Retention (if used) rounded and placed in dentin of gingival/incisal walls just axial to DEJ. All caries and previous restorative material removed.",
        acceptable: "Axial wall extension too shallow. Retention excessive and undermines enamel, jeopardizes incisal angle, or encroaches on pulp.",
        notMet: "Axial wall unnecessarily deep or mechanical pulp exposure. Caries or previous restorative material remains (without approval)." },
      { name: "Treatment Management (Prep)",
        excellent: "No iatrogenic damage. Pulpal protection requested when necessary and properly placed OR not needed and not requested. Soft tissue damage consistent with procedure.",
        acceptable: "Minor iatrogenic damage (tooth can be smoothed/polished without altering ideal contour/contact).",
        notMet: "Gross iatrogenic damage. Unrecognized pulpal exposure. Gross soft tissue damage inconsistent with procedure." },
      { name: "Margin Integrity & Surface Finish",
        excellent: "Marginal excess/deficiency not detectable. Surface uniformly smooth, free of irregularities. No unwarranted recontouring.",
        acceptable: "Slight-moderate marginal excess/deficiency. Surface has slight-moderate irregularities/roughness that is correctable. Minimal unwarranted recontouring.",
        notMet: "Severe marginal excess/deficiency or open margin. Surface grainy/pitted/rough or has voids requiring redo. Gross unwarranted removal exposing dentin." },
      { name: "Contour & Contact",
        excellent: "Contact closed visually and resists floss with no shredding. Size, shape, position appropriate; embrasures satisfactory. Contour continuous with tooth form.",
        acceptable: "Contact lighter/tighter than other contacts or floss shreds slightly. Position/size deviates slightly from normal embrasure form. Contour slightly-moderately inconsistent.",
        notMet: "Contact visually open or so tight floss will not pass. Contour grossly deficient/excessive leading to potential iatrogenic damage." },
      { name: "Occlusion",
        excellent: "Centric and excursive contacts consistent in size, shape, intensity of remaining teeth.",
        acceptable: "Restoration in hyper-occlusion and requires adjustment.",
        notMet: "Restoration in gross hyper-occlusion; restoration is only point of contact in quadrant." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 4: FIXED PROSTHODONTICS ======================
const PES_PART4 = [
  {
    id: "CRN1", code: "CRN1", part: "fixedProsth",
    name: "Indirect Full Coverage Restoration — Step A: Preparation & Provisionalization",
    deadline: { semester: "D4-spring", text: "Prior to graduation spring (DAOB 343)" },
    prereq: "2 conventional indirect full coverage restorations (NOT digital).",
    prereqCheck: (counts) => checkCount(counts, "indirectRestSU", 2, "conventional crowns"),
    caseSelect: "At least one tooth with proximal contact, opposing tooth to evaluate occlusal contact. Must be conventional crown, not digital. OK to remove a defective crown and use that tooth.",
    protocol: "Steps A and B/C must be on same patient with one calibrated faculty. Book Restorative chair in HOME clinic with description 'Crown PE'. Indicate faculty. Print instruction sheet, grading criteria, and most recent Dashboard. Faculty start check, work independently.",
    criteria: [
      { name: "Preparation: Axial and Occlusal Reduction",
        excellent: "Sufficient axial reduction (1.25-1.5mm), ideal taper for retention (4-10°), no undercuts. Occlusal reduction follows contour and shape of cusps and inclines with adequate reduction (1.5-2.0mm).",
        acceptable: "Not ideal axial reduction <1.25mm or >1.50mm but clinically acceptable. Taper not ideal (>10° but <20°). No undercuts.",
        notMet: "Axial reduction grossly over/under-prepared. Taper non-retentive (>20°). Presence of undercuts. Occlusal reduction grossly over/under-prepared." },
      { name: "Preparation: Finish Line and Finish",
        excellent: "Shoulder/chamfer 1.0-1.25mm wide all around. Finish line continuous and distinct, on sound tooth structure. All surfaces smooth and rounded.",
        acceptable: "Shoulder/chamfer not ideal but clinically acceptable in some areas. Finish line has slight discrepancies that will not compromise fit. Surfaces have minor rough areas.",
        notMet: "Finish line not distinct. Margins on unsound tooth structure. Very rough areas or steps. Line angles grossly over-rounded or sharp." },
      { name: "Preparation: Soft Tissue & Adjacent Teeth",
        excellent: "Adjacent tooth/teeth and soft tissues intact and not traumatized.",
        acceptable: "Adjacent tooth abraded (requires reshaping, changes contact position). Soft tissue has slight abrasion consistent with procedure.",
        notMet: "Adjacent tooth damaged requiring restoration and/or soft tissue laceration not consistent with procedure." },
      { name: "Provisionalization: Margins",
        excellent: "Closed; isolated areas slightly overextended (excess) or underextended (tooth ledge) <0.25mm.",
        acceptable: "Closed; slightly over/underextended <0.5mm but still consistent with gingival health.",
        notMet: "Open or severe excess/overhang or tooth ledge >0.5mm; without instructor intervention failure imminent." },
      { name: "Provisionalization: Proximal Contacts",
        excellent: "Contact(s) closed, identical firmness to other contacts; proper position OG and BL.",
        acceptable: "Contact(s) closed but lighter/firmer than others; moderately malpositioned OG and/or BL.",
        notMet: "Contacts visibly open or so tight floss will not pass safely or shreds/breaks; grossly improper size or position." },
      { name: "Provisionalization: Occlusion & Finish",
        excellent: "Maximum intercuspation with no traumatic contacts. Surfaces smooth and polished.",
        acceptable: "Light or few intercuspation contacts. Contacts may be heavy but corrected with minor adjustment. Not ideally polished but acceptable.",
        notMet: "No contacts or has traumatic contacts. Not polished to a point consistent with gingival health." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CRN2", code: "CRN2", part: "fixedProsth",
    name: "Indirect Full Coverage Restoration — Step B: Final Impression",
    deadline: { semester: "D4-spring", text: "Prior to graduation spring (DAOB 343)" },
    prereq: "2 conventional indirect full coverage restorations.",
    prereqCheck: (counts) => checkCount(counts, "indirectRestSU", 2, "conventional crowns"),
    caseSelect: "Same patient as CRN1.",
    protocol: "Steps B and C must be on same patient with one calibrated faculty.",
    criteria: [
      { name: "Tissue Management / Retraction",
        excellent: "Tissue healthy; retraction allows 0.5mm of un-cut tooth beyond margin to be captured without bleeding or moisture contamination.",
        acceptable: "Minor bleeding or moisture that does not affect critical margin area.",
        notMet: "Inflammation or bleeding prevents clear capture of margin; retraction inadequate." },
      { name: "Final Impression",
        excellent: "Impression free of voids, pulls, or tears in critical areas (margins and 0.5mm beyond). All teeth in arch captured.",
        acceptable: "Minor voids or pulls in non-critical areas (occlusal surfaces of non-prep teeth).",
        notMet: "Voids, pulls, or tears on preparation margins. Critical anatomy missing." },
      { name: "Opposing & Bite Registration",
        excellent: "Accurate alginate impression of opposing arch and accurate bite registration in MI or CR as indicated.",
        acceptable: "Minor voids in opposing impression that do not affect occlusion.",
        notMet: "Gross distortion of opposing arch or inaccurate bite registration that prevents mounting." },
      { name: "Local Anesthesia",
        excellent: "Local anesthesia achieved and patient appeared comfortable during procedure.",
        acceptable: null,
        notMet: "Local anesthesia not achieved and patient appeared uncomfortable; instructor intervention needed." },
      { name: "Lab Script",
        excellent: "Appropriately written lab script communicating material, shade, and details of final restoration.",
        acceptable: null,
        notMet: "Lab script does not properly communicate all necessary information to fabricate final restoration." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CRN3", code: "CRN3", part: "fixedProsth",
    name: "Indirect Full Coverage Restoration — Step C: Crown Cementation",
    deadline: { semester: "D4-spring", text: "Prior to graduation spring (DAOB 343)" },
    prereq: "2 conventional indirect full coverage restorations.",
    prereqCheck: (counts) => checkCount(counts, "indirectRestSU", 2, "conventional crowns"),
    caseSelect: "At least one tooth with proximal contact and opposing tooth to evaluate occlusion.",
    protocol: "Same patient as CRN2.",
    criteria: [
      { name: "Marginal Adaptation",
        excellent: "All margins are sealed, as checked with explorer.",
        acceptable: null,
        notMet: "Unacceptable; marginal deficiency or inappropriate margins." },
      { name: "Proximal Contacts",
        excellent: "Floss snaps with no shredding, visually closed. Proper location for gingival health.",
        acceptable: "Contact closed but lighter or tighter than ideal.",
        notMet: "Proximal contact open visually. Location not consistent with proper gingival health." },
      { name: "Occlusal Contacts",
        excellent: "Location and intensity correct with respect to centric occlusion and lateral movements.",
        acceptable: null,
        notMet: "Intensity not correct. Occlusal high; without instructor intervention failure imminent." },
      { name: "Esthetics",
        excellent: "Shade, contour, and aesthetics acceptable to patient and instructor.",
        acceptable: null,
        notMet: "Shade or contour not acceptable to patient and instructor. Remake necessary." },
      { name: "Pre-Cementation Bitewing",
        excellent: "Radiograph clinically acceptable in quality. Student appropriately interpreted radiograph.",
        acceptable: null,
        notMet: "Radiograph not diagnostic. Student did not appropriately interpret. Patient refused but student did not inform instructor." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 5: REMOVABLE PROSTHODONTICS ======================
const PES_PART5 = [
  {
    id: "CD1", code: "CD1", part: "removable",
    name: "Complete Denture — Step 1: Preliminary Impression",
    deadline: { semester: "D4-spring", text: "End of Spring D4/A4" },
    prereq: "Chicago Denture case OR one arch conventional denture in undergraduate group practices completed.",
    prereqCheck: null,
    caseSelect: "One arch completely edentulous, fully healed/healthy tissue, no need for pre-prosthetic surgery. Opposing may be dentate, partial, or completely edentulous. TP code D5110/D5120 replaced by competency code D5110P/D5120P.",
    protocol: "All five steps with one calibrated faculty member. No assistance from colleagues or faculty during clinical steps.",
    criteria: [
      { name: "Patient Selection",
        excellent: "Appropriate selection: one arch completely edentulous and fully healed/healthy tissue with no need for pre-prosthetic surgery. TP denture code replaced by competency code D5110P/D5120P. Appropriate faculty approval obtained.",
        acceptable: "Did not recognize need for altered code use. Corrected chairside with faculty.",
        notMet: "Inappropriate selection: patient not completely edentulous, tissue not fully healed, unhealthy tissue requiring pre-operative therapy." },
      { name: "Preliminary Impression",
        excellent: "Appropriate tray selection (metal edentulous or plastic stock). Tray modification needs identified & addressed. Anatomic landmarks accurately recorded. Necessary vestibular extension and roll captured. No voids.",
        acceptable: "Anatomic landmarks present with minor distortion/voids. Minor underextension of vestibule (<2mm). Minor voids that will not affect final custom tray.",
        notMet: "Inappropriate tray selection that does not allow proper recording of landmarks. Key landmarks missing. Major underextension (>2mm). Obvious distortion, large voids in key areas." },
      { name: "Treatment & Tissue Management",
        excellent: "No soft tissue trauma. All restorative material and debris removed from patient's mouth and face.",
        acceptable: null,
        notMet: "Soft tissue trauma present. Remaining restorative material and debris in patient's mouth/face." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CD2", code: "CD2", part: "removable",
    name: "Complete Denture — Step 2: Border Molding & Final Impression",
    deadline: { semester: "D4-spring", text: "End of Spring D4/A4" },
    prereq: "CD1 completed.",
    prereqCheck: null,
    caseSelect: "Same patient as CD1.",
    protocol: "One calibrated faculty throughout all 5 steps.",
    criteria: [
      { name: "Preliminary Cast",
        excellent: "Dense, bubble free, no artifacts. Base 13-20mm thick, parallel to ridge. Proper trimming (rounded & clean) with vestibular roll. Anatomic landmarks accurately recorded and highlighted.",
        acceptable: "Base 6-13mm thick. Slight canting relative to ridge. Minor errors in trimming leading to under-extension or canting. Landmarks distorted or unmarked.",
        notMet: "Cast has significant debris/voids. Base <6mm thick and prone to fracture. Excessive canting. Improper trimming leading to loss of key landmarks. Key landmark missing." },
      { name: "Custom Tray",
        excellent: "Wax spacer present & in proper location. Tray stable and well adapted to cast. Thickness ~2mm. Outline 2mm short of expected extension with smooth borders. Proper handle dimension/location. Fully cured.",
        acceptable: "Minor discrepancies in wax relief location. Minor voids in resin not undermining stability. Minor thickness deviations. Outline under/overextended by 1mm.",
        notMet: "Wax relief absent or melted off. Unstable or difficult to remove. Too thin, leading to fracture. Outline under/overextended ≥2mm. Handle dimension affects border molding. Not fully cured." },
      { name: "Border Molding",
        excellent: "Tray extension verified/adjusted intraorally. Rounded, properly extended, smooth. Compound well adhered. All landmarks recorded. Proper extension into vestibule for adequate suction.",
        acceptable: "Irregular adaptation, thinning of border. Landmarks present with minor distortion/voids. Minor under/over extension of vestibule.",
        notMet: "Tray overextended, border not captured in compound. Compound loose. Landmarks not recorded. Major under/over extension of vestibule." },
      { name: "Final Impression",
        excellent: "Landmarks accurately recorded/identifiable. Uniform thickness, no voids/bubbles or tray show-thru. Matches border molded custom tray extension.",
        acceptable: "Insignificant voids/creases; show-thru of border molding or non-support areas.",
        notMet: "Anatomic landmarks not recorded. Large voids; show-thru in support areas. Significant over/under extension." },
      { name: "Patient Management",
        excellent: "Explained procedure in an understandable manner. Patient in no distress throughout appointment.",
        acceptable: "Some minor discomfort addressed.",
        notMet: "No attempt to explain procedure. Patient in distress throughout." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CD3", code: "CD3", part: "removable",
    name: "Complete Denture — Step 3: Wax-Rim Try-In & Interocclusal Records",
    deadline: { semester: "D4-spring", text: "End of Spring D4/A4" },
    prereq: "CD2 completed.",
    prereqCheck: null,
    caseSelect: "Same patient as previous CD steps.",
    protocol: "One calibrated faculty throughout.",
    criteria: [
      { name: "Master Cast",
        excellent: "Dense, bubble free. Base 13-20mm thick. Properly trimmed & indexed. Landmarks accurately recorded/highlighted. Horizontal 3mm land area with 1-2mm vestibular roll.",
        acceptable: "Base 6-13mm thick. Minor trimming errors; not indexed. Land area absent in small areas.",
        notMet: "Significant debris/slurry/voids. Base <6mm thick. Excessive defect or loss of key landmarks. Absence of land area all around." },
      { name: "Record Base & Occlusal Wax-Rims",
        excellent: "Stable base, accurate adaptation. Uniform thickness, proper extension/block outs. Proper wax-rim dimension, orientation, and contour.",
        acceptable: "Minor voids; minor underextension. <4mm deviation in rim dimension or orientation.",
        notMet: "Unstable base. Overextension onto land area or underextension. Rim not adhered, improper orientation, >4mm deviation in height/thickness." },
      { name: "Lip Support, Display, & Plane",
        excellent: "Proper support/display based on esthetics/phonetics. Used extraoral landmarks for occlusal plane. Marked midline, smile line, and canine.",
        acceptable: "Minor discrepancy in support/display or occlusal plane positioning.",
        notMet: "Major discrepancy compromising esthetics/phonetics. Plane canted or too high/low. Midline or canine position not marked." },
      { name: "Vertical Dimension",
        excellent: "Vertical dimension of occlusion within physiologic limits.",
        acceptable: "Slightly excessive or deficient but clinically acceptable.",
        notMet: "Over closed or too open." },
      { name: "Facebow & Records",
        excellent: "Facebow accurately positioned. Centric record accurate, reproducible, casts seat without interference. Appropriate tooth mold/shade selected.",
        acceptable: "Student recognizes record inaccuracy and need to re-register.",
        notMet: "Facebow inaccurate in any dimension. Record inaccurate/not reproducible. Casts do not fit record. Inappropriate mold/shade." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CD4", code: "CD4", part: "removable",
    name: "Complete Denture — Step 4: Trial Denture Try-in",
    deadline: { semester: "D4-spring", text: "End of Spring D4/A4" },
    prereq: "CD3 completed.",
    prereqCheck: null,
    caseSelect: "Same patient as previous CD steps.",
    protocol: "One calibrated faculty throughout.",
    criteria: [
      { name: "Articulation & Arrangement",
        excellent: "Casts properly articulated; no contact between record bases. Anterior teeth in ideal position; horizontal/vertical overlap appropriate. Mandibular posterior teeth over center of ridge. Bilateral balanced occlusion obtained.",
        acceptable: "Mounting stone rough. Minor modification in anterior or posterior tooth position necessary prior to try-in.",
        notMet: "Casts improperly articulated or touching. Horizontal/vertical overlap inappropriate. Teeth touch in MI. Posterior teeth impinge tongue. No balanced occlusion or traumatic occlusion." },
      { name: "Trial Denture Try-in",
        excellent: "Proper lip support/display and interpupillary/ala-tragus plane orientation. Vertical and centric records reproducible/accurate. Acrylic shade selected.",
        acceptable: "Discrepancy in support/display. Shade/shape needs change. Inaccuracy recognized in vertical/centric records.",
        notMet: "Major discrepancy. Canted plane. Student does not recognize inaccurate records or need for remount. Acrylic shade not selected." },
      { name: "Final Details & Consent",
        excellent: "PPS properly marked/carved relative to vibrating line. Patient involved in shade/mold/arrangement discussion and signed informed consent.",
        acceptable: "PPS carved with minor discrepancies.",
        notMet: "PPS not marked or carved with significant discrepancies. Patient not involved in discussion or consent not obtained." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "CD5", code: "CD5", part: "removable",
    name: "Complete Denture — Step 5: Denture Delivery",
    deadline: { semester: "D4-spring", text: "End of Spring D4/A4" },
    prereq: "CD4 completed.",
    prereqCheck: null,
    caseSelect: "Same patient as previous CD steps.",
    protocol: "One calibrated faculty throughout.",
    criteria: [
      { name: "Bases and Flanges",
        excellent: "Proper extensions. Uniform contact to tissue under function; no excess pressure. No sharp peripheries or spicules.",
        acceptable: "Small areas of excess pressure; improper PIP use. Some sharp spicules remaining.",
        notMet: "Gross over/underextension compromising retention. Significant sharpness resulting in trauma." },
      { name: "Occlusion & Articulation",
        excellent: "Even bilateral contact in CR. Bilateral balancing contacts present without interference. No anterior contact in CO.",
        acceptable: "Missing CR contacts or anterior CR contact correctable by adjustment.",
        notMet: "Significant adjustments required; clinical remount necessary. No balancing contacts. Only anterior teeth contact in CO." },
      { name: "Finish and Patient Care",
        excellent: "All border/polished surfaces preserved. All PIP and articulating marks removed. Home-care reviewed, product dispensed, and follow-up scheduled.",
        acceptable: "Slightly rough areas needing further polish. Marks remaining on teeth.",
        notMet: "No attempt to polish. PIP remains at dismissal. No review of home-care or follow-up." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 6: SPECIALTY ======================
const PES_PART6 = [
  {
    id: "EROOT1", code: "EROOT1", part: "specialty",
    name: "Endodontic PE — Single-Rooted Tooth",
    deadline: { semester: "D3-spring", text: "End of Spring D3/AS3" },
    prereq: "At least 1 root canal treatment (RCT) completed.",
    prereqCheck: (counts) => checkCount(counts, "endo", 1, "RCTs"),
    caseSelect: "Single-canaled anterior teeth (#6-11, 22, 27).",
    protocol: "Book chair with Endodontic Scheduler. MAX 3 clinic sessions to complete. Inform attending faculty at each visit that you're doing a PE so no assistance is given. EVERY STEP must be evaluated and signed by Endodontic Evaluator BEFORE proceeding. Self-evaluate by underlining outcome on rubric before faculty check.",
    criteria: [
      { name: "Data Collection",
        excellent: "Medical history current/accurate/reviewed. Diagnostic-quality radiographs. Clinical tests complete/accurate.",
        acceptable: "Radiographic image quality not ideal but diagnosis possible. Tests complete; inaccuracies do not compromise diagnosis.",
        notMet: "Medical history outdated/inaccurate/not reviewed. Radiograph not diagnostic. Tests incomplete; inaccuracies compromise diagnosis." },
      { name: "Diagnosis & AAE Assessment",
        excellent: "Pulpal diagnosis accurate and consistent with findings. Terminology correct/reflects excellent understanding. Correct AAE case difficulty assessment.",
        acceptable: "Pulpal diagnosis incomplete — no effect on treatment outcome. Terminology has minor inaccuracies but reflects good understanding. Minor discrepancies in AAE assessment.",
        notMet: "Pulpal diagnosis inaccurate or not consistent with findings; treatment at risk. Terminology inaccurate; understanding not demonstrated. AAE assessment incomplete or inaccurate." },
      { name: "Treatment",
        excellent: "Infection control protocols in place/organized, aseptic technique. Patient comfort assured/adequate anesthesia. Proper isolation (no salivary contamination). Student organized and prepared.",
        acceptable: "Patient has minimal discomfort. Student organization and preparation show some areas of weakness; expectations not totally realistic but mostly achievable.",
        notMet: "Infection control protocols violated/disorganized, septic technique. Patient experiences significant pain with no regard for comfort. Isolation inadequate (salivary leakage). Student disorganized/unprepared." },
      { name: "Access Opening",
        excellent: "Complete caries removal. Extension conserves tooth structure. Straight line access to canal(s). All necessary pulp horns and pulp tissue removed. Internal access smooth and confluent into canals.",
        acceptable: "Overextension slightly compromises tooth structure. Lack of complete straight-line access but still allows access. Access conservative but doesn't compromise case; catch at pulp horns evident; some minor ledges/gouges.",
        notMet: "Caries remaining. Overextension compromises prognosis. No straight-line access; canal not found. Access underextension; pulp horn(s) left uncleansed. Perforation of chamber, floor, or walls; severe gouge." },
      { name: "Biomechanical Prep",
        excellent: "Working radiographs adequate. Canal preparation within 1.0-0.5mm of radiographic apex. Canal prepared to adequate size and taper. Preparation creates solid apical stop.",
        acceptable: "Working radiographs less than ideal but diagnostic. Canal prep at or 1.5-2.0mm short of radiographic apex or to apex. Canal prep creates minor irregularities. Apical stop light, but seat present.",
        notMet: "Working radiographs not diagnostic or more than 5 exposures for each WL/MAF/MC step. Canal prep beyond apex or more than 2.0mm short. Ledges, zips, strips, perforation, or separated instrument. No apical stop." },
      { name: "Obturation",
        excellent: "Fill within 1.0-0.5mm of radiographic apex. Fill adaptation dense from apex to cervical, no voids. Chamber properly cleansed.",
        acceptable: "Fill at or 1.5-2.0mm short of radiographic apex or overextension <1.0mm. Dense RCF with minor voids in cervical 2/3. Some gutta percha/sealer in chamber.",
        notMet: "Fill >2.0mm short of radiographic apex or overextended >1.0mm. Inadequate density of fill with voids in apical 1/3. Chamber has significant debris, gutta percha, or sealer." },
      { name: "Temporary Restoration",
        excellent: "Restoration seals chamber. Occlusion provides centric stop; absence of balancing contacts; properly out of occlusion.",
        acceptable: "Centric light; slight prematurities (patient unaware).",
        notMet: "Restoration fails to seal chamber. Restoration significantly high/occlusion not checked; out of occlusion improperly." },
    ],
    criticalDeficiencies: [
      "Case Selection — selection of a case not suitable for a PE.",
      "Professionalism — violation of professionalism standards.",
      "Patient Management/Infection Control — breach of protocol or safety.",
      "Time Management — failure to complete the case within three clinic sessions.",
      "Preparedness/Cleanliness — disorganized operatory or inability to answer questions.",
      "Instructor Intervention Required — faculty must intervene to complete procedure.",
    ],
  },
  {
    id: "EROOT2", code: "EROOT2", part: "specialty",
    name: "Endodontic PE — Multi-Rooted Tooth",
    deadline: { semester: "D4-fall", text: "End of Fall D4/AS4" },
    prereq: "At least 1 root canal treatment (RCT) completed.",
    prereqCheck: (counts) => checkCount(counts, "endo", 1, "RCTs"),
    caseSelect: "Premolars or molars with 'Minimal' or 'Moderate' AAE difficulty level.",
    protocol: "Same as EROOT1 — max 3 sessions, inform faculty no assistance, every step signed by evaluator before proceeding.",
    criteria: [
      // Same rubric as EROOT1
      { name: "Data Collection",
        excellent: "Medical history current/accurate/reviewed. Diagnostic-quality radiographs. Clinical tests complete/accurate.",
        acceptable: "Image quality not ideal but diagnosis possible. Tests complete; inaccuracies do not compromise diagnosis.",
        notMet: "Medical history outdated/inaccurate/not reviewed. Radiograph not diagnostic. Tests incomplete; inaccuracies compromise diagnosis." },
      { name: "Diagnosis & AAE Assessment",
        excellent: "Pulpal diagnosis accurate. Terminology correct. Correct AAE case difficulty assessment.",
        acceptable: "Pulpal diagnosis incomplete — no effect on outcome. Terminology has minor inaccuracies. Minor discrepancies in AAE assessment.",
        notMet: "Pulpal diagnosis inaccurate; treatment at risk. Terminology inaccurate. AAE assessment incomplete or inaccurate." },
      { name: "Treatment",
        excellent: "Infection control in place; aseptic. Patient comfort assured. Proper isolation. Student organized and prepared.",
        acceptable: "Patient has minimal discomfort. Student organization shows some weakness; expectations mostly achievable.",
        notMet: "Infection control violated. Patient experiences significant pain. Isolation inadequate. Student disorganized/unprepared." },
      { name: "Access Opening",
        excellent: "Complete caries removal. Extension conserves tooth structure. Straight line access. All pulp horns/tissue removed. Internal access smooth and confluent.",
        acceptable: "Overextension slightly compromises tooth structure. Lack of complete straight-line access but allows access. Some minor ledges/gouges.",
        notMet: "Caries remaining. Overextension compromises prognosis. No straight-line access; canal not found. Pulp horn(s) left uncleansed. Perforation; severe gouge." },
      { name: "Biomechanical Prep",
        excellent: "Working radiographs adequate. Canal prep within 1.0-0.5mm of apex. Adequate size and taper. Solid apical stop.",
        acceptable: "Working radiographs less than ideal but diagnostic. Canal prep 1.5-2.0mm short or to apex. Minor irregularities. Apical stop light but seat present.",
        notMet: "Working radiographs not diagnostic or >5 exposures per WL/MAF/MC step. Canal prep beyond apex or >2.0mm short. Ledges, zips, strips, perforation, or separated instrument. No apical stop." },
      { name: "Obturation",
        excellent: "Fill within 1.0-0.5mm of apex. Dense fill from apex to cervical, no voids. Chamber properly cleansed.",
        acceptable: "Fill 1.5-2.0mm short or overextension <1.0mm. Dense RCF with minor voids in cervical 2/3. Some gutta percha/sealer in chamber.",
        notMet: "Fill >2.0mm short or overextended >1.0mm. Inadequate density with voids in apical 1/3. Significant debris, gutta percha, or sealer in chamber." },
      { name: "Temporary Restoration",
        excellent: "Restoration seals chamber. Occlusion provides centric stop, no balancing contacts, properly out of occlusion.",
        acceptable: "Centric light; slight prematurities (patient unaware).",
        notMet: "Restoration fails to seal chamber. Restoration significantly high/occlusion not checked." },
    ],
    criticalDeficiencies: [
      "Case Selection",
      "Professionalism",
      "Patient Management/Infection Control",
      "Time Management — failure to complete within three clinic sessions",
      "Preparedness/Cleanliness",
      "Instructor Intervention Required",
    ],
  },
  {
    id: "OS", code: "OS", part: "specialty",
    name: "Oral Surgery Performance Exam",
    deadline: { semester: "D4-spring", text: "Throughout OS rotation" },
    prereq: "Declare procedure as PE prior to starting.",
    prereqCheck: null,
    caseSelect: "Routine extraction.",
    protocol: "Procedure to be challenged as PE must be declared prior to starting.",
    criteria: [
      { name: "Patient Evaluation & Presentation",
        excellent: null,
        acceptable: "Vital signs taken/recorded. Medical history performed comprehensively. Orofacial evaluation complete and accurate. Dental chief complaint complete; gathered all pertinent information for diagnosis.",
        notMet: "Vital signs not taken/recorded. Medical history incomplete or inaccurate; pertinent information omitted. Failed orofacial evaluation. Did not accurately access dental chief complaint; did not gather appropriate radiographs." },
      { name: "Patient Risk Management",
        excellent: null,
        acceptable: "Recognizes need for referral (medical & specialty). Medical consultation accurately completed and interpreted. Dental specialty consultation completed and interpreted.",
        notMet: "Did not recognize need for referral. Medical consultation not accurately completed; omitted pertinent information; did not interpret returned consult. Dental consultation not accurately completed." },
      { name: "Surgical Procedure",
        excellent: null,
        acceptable: "Local anesthesia achieved. Proficient surgical extraction following all surgical principles. Effective use of instruments. Hemostasis achieved. Minimum trauma to soft and hard tissue.",
        notMet: "Local anesthesia not achieved. Improper extraction technique. Ineffective use of instruments. Hemostasis not achieved. Excessive trauma. Flap design not consistent with anatomical concepts." },
      { name: "Post-Operative Care & Instructions",
        excellent: null,
        acceptable: "Provides basic patient post-operative care and instructions. Accurately recorded the procedure and completed the procedure note that reflected the visit concisely.",
        notMet: "Did not provide post-op care/instructions, or instructions not proper or placed patient in possible harm. Inaccurately recorded procedure or omitted pertinent information." },
    ],
    criticalDeficiencies: ["Standard six (Professionalism, Patient Management/Infection Control, Time Management, Preparedness/Cleanliness, Instructor Intervention)"],
  },
  {
    id: "OMED", code: "OMED", part: "specialty",
    name: "Oral Medicine — Extraoral/Intraoral Exam",
    deadline: { semester: "D4-fall", text: "During Oral Medicine rotation" },
    prereq: "None specified.",
    prereqCheck: null,
    caseSelect: "Comprehensive head and neck examination patient.",
    protocol: "Comprehensive head and neck exam plus periodontal risk assessment.",
    criteria: [
      { name: "Medical History and Risk Assessment",
        excellent: null,
        acceptable: "Introduced self and explained purpose. Reported all medications and conditions. Questioned patient about smoking/tobacco/alcohol/HPV and correctly documented in EPR.",
        notMet: "Did not introduce self/did not explain procedure. Did not report all conditions and medications. Did not correctly document patient in EPR as tobacco/alcohol user/non-user/HPV." },
      { name: "Extraoral Exam",
        excellent: null,
        acceptable: "Examined face for asymmetry, swelling, discoloration. Examined skin for lesions. Palpated TMJ, muscles of mastication, and lymph nodes (submental, submandibular, cervical, supraclavicular).",
        notMet: "Did not examine face for asymmetry, swelling, discoloration. Did not examine skin for lesions. Did not palpate TMJ, muscles, or lymph nodes." },
      { name: "Intraoral Exam",
        excellent: null,
        acceptable: "Visually examined and palpated lips, labial/buccal mucosa, gingiva, tongue (dorsum, lateral borders, ventral). Examined floor of mouth and palpated bimanually. Examined hard palate, soft palate, uvula, tonsils, pharyngeal wall.",
        notMet: "Did not visually examine and palpate lips, mucosa, gingiva, or tongue. Did not examine floor of mouth or palpate bimanually. Did not examine hard/soft palate, uvula, tonsils, or pharyngeal wall." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];


// ====================== PART 7: ROTATION-SPECIFIC ======================
const PES_PART7 = [
  {
    id: "PEDO_EXAM", code: "D9107", part: "rotation",
    name: "Pediatric Examination & Treatment Planning",
    deadline: { semester: "D3-spring", text: "End of Spring D3 / Fall A4 (must be by end of pediatric rotation)" },
    prereq: "2 comprehensive oral examinations & treatment planning on pediatric patients.",
    prereqCheck: null, // peds COE not separately tracked from adult COE in MEE
    caseSelect: "Pediatric patient in mixed dentition; either initial exam or recall ≥24 months from last exam. Patient must need new radiographs.",
    protocol: "Collect subjective info from parent and child. Complete clinical exam of EOE/IOE soft and hard tissues. Determine and take necessary radiographs. Complete treatment plan in axiUm. Faculty reviews case and examines patient.",
    criteria: [
      { name: "Subjective Information",
        excellent: "Chief Concern properly identified. Medical history thorough; additional details collected for positive responses.",
        acceptable: "Chief concern only partially accurate. Med hx complete but missing details (vaccination, birth, physician info).",
        notMet: "Chief concern not known or inaccurate. Med hx missing areas of significant importance or insufficient detail." },
      { name: "Soft Tissue Examination",
        excellent: "Intra and extra oral soft tissues properly examined and all findings accurate.",
        acceptable: "Soft tissues examined; minor inaccuracies in findings.",
        notMet: "Soft tissues not examined or multiple inaccuracies in findings." },
      { name: "Hard Tissue Examination",
        excellent: "Hard tissues properly identified (Primary vs. Permanent); hard tissue and occlusal exam accurate.",
        acceptable: "Hard tissues properly identified, but small details may be missing from hard tissue or occlusal exam.",
        notMet: "Teeth incorrectly identified or hard tissue/occlusal exam not completed." },
      { name: "Radiographic Examination",
        excellent: "Radiographs properly prescribed; images of diagnostic quality.",
        acceptable: "Radiographs properly prescribed, but images may have some non-diagnostic areas.",
        notMet: "Radiographs improperly prescribed, or images of poor diagnostic quality; multiple retakes without input." },
      { name: "Documentation",
        excellent: "Pedo Exam form complete. Odontogram properly documents teeth present. Radiographs properly interpreted.",
        acceptable: "Pedo Exam form has minor areas missing. Radiographs interpreted but some findings may be inaccurate.",
        notMet: "Pedo Exam form has entire sections missing. Odontogram misidentified teeth. Radiographs not interpreted." },
      { name: "Caries Treatment Planning",
        excellent: "All caries correctly identified/recorded. Appropriate treatment prescribed for all lesions.",
        acceptable: null,
        notMet: "Significant omissions in identifying caries. Inappropriate treatment plan developed." },
      { name: "Case Presentation",
        excellent: "Case presented logically/clearly. Correct terminology used.",
        acceptable: "Presentation somewhat disorganized. Some use of lay terms or overly lengthy.",
        notMet: "Presentation incoherent or incomplete. Use of slang or incorrect terms." },
      { name: "Referrals",
        excellent: "Necessary referrals to specialty care properly identified and completed.",
        acceptable: "Referrals identified but not properly completed.",
        notMet: "Referrals not completed or recommended inappropriately." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "PEDO_REST", code: "D9106", part: "rotation",
    name: "Pediatric Primary Tooth Restorative Exam",
    deadline: { semester: "D3-spring", text: "By end of pediatric rotation" },
    prereq: "None specified.",
    prereqCheck: null,
    caseSelect: "Primary tooth requiring an interproximal restoration (Class II, Class III, or stainless steel crown).",
    protocol: "Complete tooth preparation independently. Restoration cannot proceed until preparation has been evaluated and clearance given by faculty.",
    criteria: [
      { name: "Isolation",
        excellent: "Rubber dam has no faults and is properly inverted to produce seal.",
        acceptable: "Rubber dam has minor tear/leakage/gapping/bunching.",
        notMet: "Rubber dam not functional or not present." },
      { name: "Preparation",
        excellent: "Caries/restorative material completely removed. Extension correct. Adjacent structures intact.",
        acceptable: "Minor caries/material remains in non-critical area. Minor abrasion to adjacent structures.",
        notMet: "Gross caries remains. Preparation extension grossly over/under. Unwarranted damage to adjacent structures." },
      { name: "Pulp Management",
        excellent: "Pulp management appropriate (Liner/Pulpotomy/VPT).",
        acceptable: "Pulp management acceptable but not ideal.",
        notMet: "Pulp management inappropriate or unwarranted pulp exposure." },
      { name: "Margin & Surface",
        excellent: "Margins not detectable. Surface uniformly smooth. SSC: Margins adapted; no flaws in crown.",
        acceptable: "Slight marginal excess/deficiency. Surface has minor irregularities. SSC: Minor flaws.",
        notMet: "Severe marginal excess or open margin. Surface rough/pitted. SSC: Poor adaptation; gross flaws." },
      { name: "Contour & Contact",
        excellent: "Restoration contour continuous with tooth form. Proximal contacts closed and appropriate position.",
        acceptable: "Contour slightly inconsistent. Contact light or slightly malpositioned.",
        notMet: "Contour grossly excessive/deficient. Contact visibly open or grossly malpositioned." },
      { name: "Occlusion",
        excellent: "Centric and excursive contacts consistent with existing dentition.",
        acceptable: null,
        notMet: "Restoration in hyper-occlusion." },
      { name: "Patient Management",
        excellent: "Local anesthesia achieved; behavior managed effectively.",
        acceptable: "Anesthesia not fully achieved; behavior managed with some difficulty.",
        notMet: "Anesthesia not achieved; behavior unmanageable; instructor intervention needed." },
      { name: "Cleanup",
        excellent: "All debris removed; operative site clean.",
        acceptable: "Minor debris remains.",
        notMet: "Significant debris or rubber dam remains." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
  {
    id: "URGENT", code: "Urgent Care", part: "rotation",
    name: "Urgent Care Performance Exam",
    deadline: { semester: "D4-fall", text: "Third semester of Urgent Care Rotation" },
    prereq: "Urgent Care faculty assists with identifying suitable patient.",
    prereqCheck: null,
    caseSelect: "Urgent Care faculty will assist with identifying suitable patient.",
    protocol: "Independently deliver urgent care therapy: appropriate assessment, diagnosis, palliative care or referral.",
    criteria: [
      { name: "Patient Interview",
        excellent: "Significant findings/implications documented. Trust developed; organized; correct terminology.",
        acceptable: "Significant findings documented but emphasis lacking. Patient comfortable but not forthcoming.",
        notMet: "Lack of documentation. Patient ill at ease; random presentation; slang or incorrect terms." },
      { name: "Oral Facial Assessment",
        excellent: "All extra/intra-oral findings correct. Consult indications identified.",
        acceptable: "Most findings correct (no effect on dx). Consultation discussed.",
        notMet: "Findings incorrect; dx compromised. Omission of findings. Consult indicated but not requested." },
      { name: "Radiology",
        excellent: "Orders appropriate imaging. Minimizes radiation. Quality properly assessed. Pathology ID'd.",
        acceptable: "Minor error in imaging selection. Acquisition results in a few retakes.",
        notMet: "Significant error in imaging selection. Excessive retakes. Major errors in assessment/pathology ID." },
      { name: "Assessment & Diagnosis",
        excellent: "Evidence of synthesis; analysis supported by findings; well organized.",
        acceptable: "Minor errors in analysis not affecting tx. Organized but relationships not fully developed.",
        notMet: "Error in thinking leading to inappropriate tx. Random presentation." },
      { name: "Treatment Planning",
        excellent: "Ideal/alternative plans correct/complete. Patient questions answered. Procedures sequenced.",
        acceptable: "Plans correct but alternatives incomplete. Patient not fully clear; sequence variations.",
        notMet: "Plans omitted/inappropriate. Questions unanswered. Consent missing. Sequence compromises plan." },
      { name: "Management & Rx",
        excellent: "Appropriate therapy rendered. Med consult generated if needed. Post-op instructions correct.",
        acceptable: "Therapy acceptable. Post-op instructions clear, some amplification needed.",
        notMet: "Therapy inappropriate. Med consult indicated but not generated. Post-op instructions omitted." },
    ],
    criticalDeficiencies: ["Standard six"],
  },
];

// Concatenate all PE arrays into a single PES_ALL constant.
const PES_ALL = [...PES, ...PES_PART2, ...PES_PART3, ...PES_PART4, ...PES_PART5, ...PES_PART6, ...PES_PART7];

// PE-to-Procedure mapping for "Show Steps" links.
// Only includes PEs with clear, exact matches to procedures.
const PE_PROCEDURE_MAP = {
  "PER01": "573",    // Periodontal Clinical Evaluation → Perio COE
  "REVA04": "1346",  // Periodontal Re-Evaluation → Perio Re-Evaluation
  "DXTX2": "2821",   // Single Tooth Replacement Dx & Tx Planning → Crown Prep
  "CR1": "2821",     // Crown & Fixed Pros Foundation → Crown Prep
  "CR2": "3204",     // Crown — Clinical Exam & Delivery → Crown Delivery
  "CD1": "1641",     // Composite I → Composite Class I
  "CD2": "1745",     // Composite II → Composite Class II
  "CD3": "1850",     // Composite III → Composite Class III
  "CD4": "1950",     // Composite IV → Composite Class IV
  "CD5": "2046",     // Composite V → Composite Class V
  "AM": "1549",      // Amalgam → Amalgam
  "RPD": "3704",     // Removable Prosthodontics (Denture) → Complete Denture #1
  "IMPLANT": "4574", // Implant (STI) → Implant-Level Impression
  "ENDO": "5472",    // Endo → RCT
};



/* ============================================================================
 * PEs TAB — Performance Exams reference + planning view.
 *
 * Three zones:
 *
 *   1. TIMELINE — horizontal strip showing all 26 PEs positioned in their
 *      deadline semester. Click any chip to scroll to its detail card.
 *      Color-coded: oxblood (past), gold (current), neutral (future). The
 *      "current" semester is determined by the date — see CURRENT_SEMESTER.
 *
 *   2. PE LIBRARY — cards grouped by Part (Perio, Restorative Foundation, etc.).
 *      Each card collapsed by default showing code, name, deadline, and
 *      eligibility badge. Tap to expand.
 *
 *   3. EXPANDED CARD — full detail: objectives, prerequisite, case selection,
 *      protocol, three-tier rubric grid, critical deficiencies.
 *
 * The eligibility badge connects to the MEE counts already saved in
 * localStorage from the RVU tab. Where prereqs map cleanly to MEE categories,
 * shows "Eligible" or "Need X more [thing]". For fuzzy prereqs (PE-completion
 * gates, mixed counts), shows just the prerequisite text.
 * ==========================================================================*/

// Determine current semester from today's date. Adjust as the academic
// calendar evolves; conservative buckets:
//   Aug-Dec → Fall, Jan-Apr → Spring, May-Jul → Summer
// This drives the "today line" on the timeline.
function currentSemester() {
  const m = new Date().getMonth(); // 0-11
  if (m >= 7 && m <= 11) return "fall";    // Aug-Dec
  if (m >= 0 && m <= 3)  return "spring";  // Jan-Apr
  return "summer";                          // May-Jul
}

// Compare a PE's deadline semester vs today's semester. Returns "past" or
// "future". We don't try to mark anything as "current" — students range D3 to
// D4 and the app doesn't ask which year they are, so any "current" highlight
// would be misleading half the time. Past flagging stays calendar-relative
// (a deadline whose season is already behind us is past, regardless of year).
function semesterStatus(pe, current) {
  // The semester id encodes "D3-spring", "D4-fall" etc. We extract season.
  const season = pe.deadline.semester.split("-")[1];
  // Order: summer → fall → spring (UIC academic year)
  const order = { summer: 0, fall: 1, spring: 2 };
  const peOrder = order[season] ?? 0;
  const curOrder = order[current] ?? 0;
  return peOrder < curOrder ? "past" : "future";
}

// (EligibilityBadge / useMEECounts removed: contracted PE cards show only the
// deadline now. Most students don't enter precise per-category MEE counts, so
// any "Need N more X" or "✓ Eligible" rendering was misleading. The PE's
// prereq text remains visible in the expanded view as plain prose.)

// Timeline — horizontal strip. Each semester is a column; PEs are chips
// inside their column. Tapping a chip scrolls to that PE's card below.
function PETimeline({ pes, scrollToPE }) {
  const current = currentSemester();
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{
        fontSize: "10px", letterSpacing: "0.22em",
        textTransform: "uppercase", color: "var(--accent)",
        fontWeight: 500, marginBottom: "12px",
      }}>
        Timeline
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${PE_SEMESTERS.length}, 1fr)`,
        gap: "8px",
      }}>
        {PE_SEMESTERS.map(sem => {
          const semPes = pes.filter(p => p.deadline.semester === sem.id);
          return (
            <div key={sem.id} style={{
              border: "1px solid var(--rule)",
              borderRadius: "3px",
              padding: "10px 8px",
              minHeight: "120px",
              background: "var(--paper-soft)",
            }}>
              <div style={{
                fontSize: "10px", letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                fontWeight: 500, textAlign: "center",
                marginBottom: "8px",
                fontFamily: "'Geist', sans-serif",
              }}>
                {sem.label}
              </div>
              <div style={{
                display: "flex", flexDirection: "column", gap: "4px",
              }}>
                {semPes.map(pe => {
                  const status = semesterStatus(pe, current);
                  const isPast = status === "past";
                  return (
                    <button key={pe.id}
                      onClick={() => scrollToPE(pe.id)}
                      style={{
                        width: "100%",
                        background: isPast ? "rgba(122, 30, 30, 0.08)" : "var(--paper)",
                        border: `1px solid ${isPast ? "var(--accent)" : "var(--rule)"}`,
                        borderRadius: "2px",
                        padding: "5px 7px",
                        fontSize: "10px",
                        fontFamily: "'Geist', sans-serif",
                        fontWeight: 500,
                        color: isPast ? "var(--accent)" : "var(--ink)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "transform 100ms ease",
                      }}
                      title={pe.name}
                    >
                      <span className="mono" style={{
                        fontVariantNumeric: "tabular-nums",
                      }}>{pe.code}</span>
                    </button>
                  );
                })}
                {semPes.length === 0 && (
                  <div style={{ color: "var(--ink-faint)", fontSize: "10px",
                      fontStyle: "italic", textAlign: "center",
                      padding: "10px 0" }}>
                    —
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Rubric grid — three columns for the three grade tiers. Side-by-side
// scannable; null cells (N/A) render as a dash.
function RubricGrid({ criteria }) {
  return (
    <div style={{
      ...cardStyle, padding: 0, overflow: "hidden",
      marginTop: "16px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(160px, 200px) 1fr 1fr 1fr",
        gap: 0,
        fontSize: "10px", letterSpacing: "0.16em",
        textTransform: "uppercase", fontWeight: 500,
        color: "var(--ink-soft)",
        background: "var(--paper-soft)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <div style={{ padding: "10px 14px" }}>Criterion</div>
        <div style={{ padding: "10px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: "var(--teal)" }}>Excellent</div>
        <div style={{ padding: "10px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: "var(--gold)" }}>Clinically Acceptable</div>
        <div style={{ padding: "10px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: "var(--accent)" }}>Standard Not Met</div>
      </div>
      {criteria.map((c, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "minmax(160px, 200px) 1fr 1fr 1fr",
          gap: 0,
          fontSize: "12px", lineHeight: 1.5,
          borderBottom: i < criteria.length - 1 ? "1px solid var(--rule-soft)" : "none",
        }}>
          <div style={{
            padding: "12px 14px",
            background: "var(--paper-soft)",
            color: "var(--ink)", fontWeight: 500,
            fontSize: "12px",
          }}>
            {c.name}
          </div>
          <div style={{
            padding: "12px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: c.excellent ? "var(--ink)" : "var(--ink-faint)",
            fontStyle: c.excellent ? "normal" : "italic",
          }}>
            {c.excellent || "—"}
          </div>
          <div style={{
            padding: "12px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: c.acceptable ? "var(--ink)" : "var(--ink-faint)",
            fontStyle: c.acceptable ? "normal" : "italic",
          }}>
            {c.acceptable || "N/A"}
          </div>
          <div style={{
            padding: "12px 14px",
            borderLeft: "1px solid var(--rule-soft)",
            color: c.notMet ? "var(--ink)" : "var(--ink-faint)",
          }}>
            {c.notMet || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

// Single PE card — collapsed shows code/name/deadline; expanded reveals all
// the structured detail (prereq, case selection, protocol, rubric, etc.).
function PECard({ pe, expanded, onToggle, peRef, onShowSteps }) {
  const procedureId = PE_PROCEDURE_MAP[pe.id];

  return (
    <div ref={peRef} style={{
      ...cardStyle, padding: 0, overflow: "hidden",
      marginBottom: "12px",
      scrollMarginTop: "20px",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left",
        background: "transparent", border: "none",
        cursor: "pointer", padding: "16px 18px",
        display: "grid",
        gridTemplateColumns: "minmax(80px, 100px) 1fr auto 24px",
        gap: "16px", alignItems: "center",
        fontFamily: "'Geist', sans-serif",
      }}>
        <span className="mono" style={{
          color: "var(--accent)", fontWeight: 500,
          fontSize: "13px", fontVariantNumeric: "tabular-nums",
        }}>
          {pe.code}
        </span>
        <span style={{
          color: "var(--ink)", fontSize: "13px", fontWeight: 500,
        }}>
          {pe.name}
        </span>
        <span style={{
          fontSize: "10px", color: "var(--ink-soft)",
          letterSpacing: "0.04em",
          fontStyle: "italic",
        }}>
          {pe.deadline.text}
        </span>
        <span style={{
          color: "var(--ink-faint)", fontSize: "13px",
          transform: expanded ? "rotate(90deg)" : "none",
          transition: "transform 140ms ease",
        }}>
          ›
        </span>
      </button>

      {expanded && (
        <div style={{
          padding: "0 18px 20px",
          fontFamily: "'Geist', sans-serif",
          borderTop: "1px solid var(--rule-soft)",
        }}>
          <div style={{ paddingTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
              <SubsectionLabel>Prerequisite</SubsectionLabel>
              {procedureId && onShowSteps && (
                <button onClick={() => onShowSteps(procedureId)} style={{
                  fontSize: "12px", color: "var(--accent)", cursor: "pointer",
                  background: "none", border: "none", textDecoration: "underline",
                  fontFamily: "'Geist', sans-serif", padding: 0, marginRight: "auto",
                }}>
                  Show Steps →
                </button>
              )}
            </div>
            <p style={{ fontSize: "13px", color: "var(--ink-soft)",
                lineHeight: 1.55, margin: "0 0 12px" }}>
              {pe.prereq}
            </p>
            <SubsectionLabel>Case Selection</SubsectionLabel>
            <p style={{ fontSize: "13px", color: "var(--ink-soft)",
                lineHeight: 1.55, margin: "0 0 12px" }}>
              {pe.caseSelect}
            </p>
            <SubsectionLabel>Protocol</SubsectionLabel>
            <p style={{ fontSize: "13px", color: "var(--ink-soft)",
                lineHeight: 1.55, margin: "0 0 4px" }}>
              {pe.protocol}
            </p>
            <div style={{ marginTop: "20px" }}>
              <SubsectionLabel>Rubric</SubsectionLabel>
              <RubricGrid criteria={pe.criteria} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <SubsectionLabel>Critical deficiencies (auto-fail)</SubsectionLabel>
              <ul style={{
                margin: "4px 0 0", padding: "0 0 0 18px",
                fontSize: "12px", color: "var(--ink-soft)",
                lineHeight: 1.55,
              }}>
                {pe.criticalDeficiencies.map((d, i) => (
                  <li key={i} style={{ marginBottom: "3px" }}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PEs({ onShowSteps }) {
  const [expanded, setExpanded] = useState(null);
  const peRefs = useRef({});

  const scrollToPE = (peId) => {
    setExpanded(peId);
    // Wait for re-render, then scroll
    setTimeout(() => {
      const node = peRefs.current[peId];
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div>
      <PETimeline pes={PES_ALL} scrollToPE={scrollToPE} />

      {PE_PARTS.map(part => {
        const partPEs = PES_ALL.filter(p => p.part === part.id);
        if (partPEs.length === 0) return null;
        return (
          <div key={part.id} style={{ marginBottom: "28px" }}>
            <div style={{
              fontSize: "10px", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "var(--accent)",
              fontWeight: 500, marginBottom: "10px",
            }}>
              {part.label}
            </div>
            {partPEs.map(pe => (
              <PECard key={pe.id}
                pe={pe}
                expanded={expanded === pe.id}
                onToggle={() => setExpanded(e => e === pe.id ? null : pe.id)}
                peRef={el => { peRefs.current[pe.id] = el; }}
                onShowSteps={onShowSteps}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}


const TABS = [
  { id: "note",        label: "Note",          hint: "Generate chart notes" },
  { id: "browse",      label: "Steps",         hint: "Read the guide" },
  { id: "walkthrough", label: "Items",         hint: "Today's equipment" },
  { id: "rvus",        label: "RVUs",          hint: "Progress & code lookup" },
  { id: "pes",         label: "PEs",           hint: "Performance exam reference" },
];

export default function App() {
  const [tab, setTab] = useState("note");
  // Globally-selected procedure — read by Browse, Note Builder, and Prep List
  // so the user's selection persists across tabs.
  const [selectedProcedureId, setSelectedProcedureId] = useState("");
  // Note Builder state lifted up here so it survives tab switches. When the
  // user fills in patient info, edits the note, then jumps to Browse and
  // back, all of that work is preserved.
  const [noteFields, setNoteFields] = useState(DEFAULT_FIELDS);
  const [noteText, setNoteText] = useState("");
  const [noteUserEdited, setNoteUserEdited] = useState(false);
  // For Prep List: separate "schedule" of multiple procedures. The Browse
  // "Add to prep list" button appends to this; selecting via the global
  // selection does not.
  const [prepRows, setPrepRows] = useState([
    { id: 1, categoryId: "", procedureId: "" },
  ]);
  const [pendingBrowseChunkId, setPendingBrowseChunkId] = useState("");

  // Browse → "Generate note for this" button.
  const handleGenerateNote = (procedureId) => {
    if (procedureId) setSelectedProcedureId(procedureId);
    setTab("note");
  };

  // Browse → "Add to prep list" button — appends a new row, then jumps tab.
  const handleAddToPrepList = (procedureId) => {
    const proc = findProcedure(procedureId);
    if (!proc) return;
    setPrepRows(rows => {
      // Dedup: if this procedure is already on the schedule, don't add again.
      if (rows.some(r => r.procedureId === procedureId)) return rows;
      // If there's an empty row at the end, fill it in instead of appending.
      const lastEmpty = rows.length > 0 &&
                        !rows[rows.length - 1].procedureId &&
                        !rows[rows.length - 1].categoryId;
      if (lastEmpty) {
        const newRows = [...rows];
        newRows[newRows.length - 1] = {
          ...newRows[newRows.length - 1],
          categoryId: proc.categoryId,
          procedureId,
        };
        return newRows;
      }
      // Else append.
      const nextId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      return [...rows, { id: nextId, categoryId: proc.categoryId, procedureId }];
    });
    setTab("walkthrough");
  };

  const handleCiteJump = (chunkId) => {
    setPendingBrowseChunkId(chunkId);
    setTab("browse");
  };

  const handleShowSteps = (procedureId) => {
    setSelectedProcedureId(procedureId);
    setTab("browse");
  };

  // Set the document title once on mount so the browser tab reads correctly.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "clinic (shea)";
    }
  }, []);

  return (
    <div className="app-root" style={{ ...ROOT_TOKENS,
      minHeight: "100vh", background: "var(--bg)",
      backgroundImage:
        "radial-gradient(1200px 600px at 10% -10%, rgba(122, 30, 30, 0.04), transparent 60%), radial-gradient(1000px 500px at 110% 110%, rgba(122, 30, 30, 0.035), transparent 55%)",
      color: "var(--ink)",
      fontFamily: "'Geist', 'Helvetica Neue', Arial, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@300..600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; }

        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .hairline      { border-top: 1px solid var(--rule); }
        .hairline-soft { border-top: 1px solid var(--rule-soft); }

        .fade-in { animation: fadeIn 320ms cubic-bezier(.2,.6,.2,1) both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }

        textarea { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        /* Ensure placeholders stay visible even when an input has
           color: transparent (used by ToothInput's invisible-text trick). */
        input::placeholder { color: var(--ink-faint); opacity: 1; }

        .dots {
          height: 1px;
          background-image: radial-gradient(circle, var(--rule) 1px, transparent 1px);
          background-size: 8px 1px; background-repeat: repeat-x;
        }

        button.primary {
          background: var(--accent); color: var(--paper);
          border: 1px solid var(--accent); padding: 10px 18px;
          font-family: 'Geist', sans-serif; font-size: 11px;
          font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: background 140ms ease, transform 140ms ease;
        }
        button.primary:hover  { background: #5E1414; }
        button.primary:active { transform: translateY(1px); }
        button.primary:disabled { background: var(--accent); }

        button.ghost {
          background: transparent; color: var(--ink-soft);
          border: 1px solid var(--rule); padding: 10px 18px;
          font-family: 'Geist', sans-serif; font-size: 11px;
          font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: border-color 140ms ease, color 140ms ease;
        }
        button.ghost:hover { border-color: var(--ink-soft); color: var(--ink); }

        .note-area {
          width: 100%;
          /* Height: at least 380px (legible on short laptop screens), at most
             the viewport minus header/title/buttons/footer breathing room. */
          min-height: 380px;
          max-height: calc(100vh - 200px);
          padding: 28px 30px;
          background: var(--mono-bg); color: var(--mono-fg);
          border: none; border-radius: 3px; font-size: 13px;
          line-height: 1.72; resize: vertical; outline: none;
          white-space: pre-wrap;
          overflow-y: auto;
        }
        @media (min-height: 800px) { .note-area { min-height: 540px; } }
        .note-area:focus { box-shadow: 0 0 0 2px var(--accent); }

        .empty-state {
          display: flex; align-items: center; justify-content: center;
          min-height: 380px;
          max-height: calc(100vh - 200px);
          background: var(--mono-bg);
          color: var(--mono-accent); border-radius: 3px;
          text-align: center; padding: 40px;
        }
        @media (min-height: 800px) { .empty-state { min-height: 540px; } }

        .chip {
          display: inline-block; padding: 3px 9px; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          background: var(--paper-soft); border: 1px solid var(--rule);
          color: var(--ink-soft); border-radius: 999px;
          font-weight: 500;
        }

        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ink-faint); animation: bounce 1.4s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }

        .tab-button {
          background: transparent; border: none;
          padding: 14px 4px; cursor: pointer;
          font-family: 'Geist', sans-serif;
          font-size: 13px; color: var(--ink-soft);
          font-weight: 400; letter-spacing: 0.02em;
          position: relative;
          transition: color 200ms cubic-bezier(.2, .6, .2, 1);
          margin-right: 32px;
        }
        .tab-button:hover { color: var(--ink); }
        .tab-button.active { color: var(--accent); font-weight: 500; }
        .tab-button.active::after {
          content: ""; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; background: var(--accent);
          animation: tabSlide 240ms cubic-bezier(.2, .6, .2, 1);
        }
        @keyframes tabSlide {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        /* Pulses the Axium-expired countdown so it catches the eye across
           the operatory. Subtle but noticeable — opacity 1 → 0.55 → 1. */
        @keyframes axiumPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }

        /* RVU table sortable header buttons — look like header text but
           clickable. */
        .rvu-th {
          background: transparent; border: none; cursor: pointer;
          padding: 0; text-align: left;
          font: inherit; letter-spacing: inherit;
          text-transform: inherit; color: inherit;
          font-weight: inherit;
          transition: color 140ms ease;
        }
        .rvu-th:hover { color: var(--accent); }

        @media (max-width: 980px) {
          .layout { grid-template-columns: 1fr !important; }
          .note-pane { position: static !important; }
          .rvu-controls { grid-template-columns: 1fr !important; }
        }

        /* First-paint fade — small but noticeable; signals "this is a
           crafted thing" rather than a default-styled web page. Runs once. */
        .app-root {
          animation: appFadeIn 360ms cubic-bezier(.2, .6, .2, 1) both;
        }
        @keyframes appFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      {/* ───────── Header ───────── */}
      <header style={{
        maxWidth: "1280px", margin: "0 auto", padding: "44px 40px 0",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", gap: "32px", flexWrap: "wrap",
          marginBottom: "32px",
        }}>
          <div>
            {/* Wordmark — set in Geist (sans), plain. Lowercase to match
                the lineage of "clinic (swade)". The author tag in italic
                oxblood is the only visual flourish. */}
            <h1 style={{
              fontFamily: "'Geist', 'Helvetica Neue', sans-serif",
              fontSize: "42px", lineHeight: 1, margin: 0,
              fontWeight: 400, letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}>
              clinic{" "}
              <span className="serif" style={{
                color: "var(--accent)", fontStyle: "italic", fontWeight: 400,
              }}>(shea)</span>
            </h1>
          </div>
        </div>

        {/* Tab nav */}
        <nav style={{
          borderBottom: "1px solid var(--rule)",
          display: "flex", flexWrap: "wrap",
        }}>
          {TABS.map((t) => (
            <button key={t.id}
              className={`tab-button ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ───────── Tab body ───────── */}
      <main style={{
        maxWidth: "1280px", margin: "0 auto",
        padding: "32px 40px 60px",
      }}>
        {tab === "note" && (
          <NoteBuilder
            selectedProcedureId={selectedProcedureId}
            onSelectProcedure={setSelectedProcedureId}
            fields={noteFields} setFields={setNoteFields}
            note={noteText} setNote={setNoteText}
            userEdited={noteUserEdited} setUserEdited={setNoteUserEdited} />
        )}
        {tab === "browse" && (
          <Browse chunks={CHUNKS}
            selectedProcedureId={selectedProcedureId}
            onSelectProcedure={setSelectedProcedureId}
            onGenerateNote={handleGenerateNote}
            onAddToPrepList={handleAddToPrepList}
            jumpToId={pendingBrowseChunkId}
            onJumped={() => setPendingBrowseChunkId("")} />
        )}
        {tab === "walkthrough" && (
          <PrepList chunks={CHUNKS}
            rows={prepRows}
            onRowsChange={setPrepRows}
            onGenerateNote={handleGenerateNote}
            onJumpTo={handleCiteJump} />
        )}
        {tab === "rvus" && <RVUs />}
        {tab === "pes" && <PEs onShowSteps={handleShowSteps} />}
      </main>
    </div>
  );
}

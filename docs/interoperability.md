# Interoperability

This document outlines the planned interoperability features of the Humanitarian Protection & Information Security Platform (HPIS).

## Humanitarian Exchange Language (HXL)

The HPIS system supports exporting case data into [HXL-tagged CSV files](https://hxlstandard.org/), a standard widely used by humanitarian organizations (like OCHA, IFRC, and UNHCR) to improve information sharing.

### HXL Export Endpoint

- **Endpoint:** `GET /api/cases/export/hxl`
- **Format:** CSV with HXL tags on the second row.
- **Access:** Requires `PROTECTION_OFFICER`, `CASE_WORKER`, `DATA_OFFICER`, or `SUPER_ADMIN` role. Export events are logged in the audit trail.

### Tag Mapping

| HPIS Field       | HXL Tag          | Description                     |
|------------------|------------------|---------------------------------|
| Case ID          | `#case+id`       | Unique identifier for the case  |
| Type             | `#indicator+type`| Category of the protection case |
| Priority         | `#priority`      | Case urgency                    |
| Region           | `#region`        | Geographic region               |
| Location         | `#loc+name`      | Specific location/district      |
| Status           | `#status`        | Current workflow state          |
| Opened Date      | `#date+opened`   | ISO8601 date when case opened   |
| Person ID        | `#person+id`     | Pseudonymized person identifier |

## Future Integration Targets

As the platform evolves, the following interoperability standards are planned for integration:

1. **ActivityInfo / KoboToolbox Integration:** API hooks to pull assessment data directly into the HPIS system for initial case creation.
2. **CPIMS+ / GBVIMS+ Interoperability:** Secure data transfer mechanisms for specialized protection workflows.
3. **FHIR (Fast Healthcare Interoperability Resources):** Standardized referral formats for medical and MHPSS (Mental Health and Psychosocial Support) cases.

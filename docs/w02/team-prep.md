# W02 Team Activity — discussion preparation only

**Important:** Actual W02 Team Activity instructions were not accessible. Topics are inferred from the student's W02 quiz. This is **not evidence a group meeting happened**, and it does not substitute for required collaboration.

Suggested items to discuss:
1. Use Swagger UI to inspect a POST request's `requestBody` and compare its documented status codes with its controller.
2. Consider a request that omits a required field: return a safe HTTP 400 instead of storing incomplete data.
3. Check that a referenced `categoryId` exists before creating/updating the related record.
4. Discuss embedding versus referencing. If reviews can grow without limit, favor a separate reviews collection linked to the product.
5. Never return raw MongoDB errors or expose `.env` secrets.

Questions to ask teammates:
- What is the happy-path and validation-failure HTTP response for this route?
- Which fields and reference IDs must be verified?
- Which database collections should own each piece of data?
- Does the Swagger Try it out request exactly match what the controller accepts?

**Student follow-up:** Read the exact Team Activity page; personally participate if required; record only actual contributions; submit the actual Canvas artifact or response.
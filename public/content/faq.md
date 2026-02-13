# FAQ

## Places

- **How are the places selected?**

    The places are extracted using the Foursquare API. We have only considered places that are verified (claimed by the owners) or that have at least 5 check-ins within six months.To preserve the anonymity of users, we only consider places where we detected at least 20 different users within the six-month period.

- **There is a place I know that isn't included, why?**

    This could happen for many reasons: it might not be included in the public Foursquare API, or we might have discarded it for privacy or statistical reasons. If you know the actual location of the place, we can possibly include it! Please send us an email specifying the name of the place, its location, and any other details for us to add it to the atlas.

- **Is your data representative?**

    In general, yes. To test if our sample of users is representative, we’ve run several analyses comparing the incomes of people in our dataset to census reports, and the average income of our user sample is only 8.6% higher than the census data. To test if our method of detecting when a person spends time in a place is accurate, we use our data to estimate attendance at professional sports games (NFL, NBA, and the NHL). Estimates of attendance computed using our data are extremely close to official attendance counts, which suggests that the data we use here can describe visits to a specific place quite well (generally within a few thousand of the official attendance counts).

## Inequality

- **What do you mean when you say a place is “65% unequal”?**

    A place is unequal if it is not visited by the four different income quartiles we've identified in the city. A high value of inequality in a place means that most of its visitors come from one or two of these income groups. You can find more information about how the inequality score is computed in the Methods section.

- **I visit place X a lot, and know that X is more/less unequal than you reported, why?**

    We determine that a user has spent time in a place when our data shows that they’ve spent more than five minutes within 20 meters of it. We’ve tried our best to be careful in assigning user locations to places, but our method isn’t perfect. When places are very close to each other (less than 20 meters), or where places are on different floors of the same building, our data is a little more noisy. Please let us know about the specific place in question by sending us an email, and we will investigate it.

## Privacy

- **Where did you obtain the data about visits at locations? Is this legal?**

    The anonymous location data come from collaboration with Cuebiq through their Data for Good program. Cuebiq is a location intelligence company that collects data through its proprietary software-development-kit technology integrated in more than 200 mobile apps, reaching a diverse user base of millions of anonymous users who have opted in to share location data. Cuebiq is fully compliant with the GDPR in the EU; its privacy-compliant methodology is at the forefront of industry standards and has earned the company membership status with the Network Advertising Initiative (NAI), the leading industry association dedicated to responsible data collection and its use for digital advertising.

- **Are you singling out individuals?**
    
    No. Never. We are not interested in individual behavior and are not using individual behavior in our analysis. We anonymize our data before analysis by aggregating by neighborhoods, and we are only interested in aggregated trends about the economic diversity of locations visited. Our final data consists of aggregations (counts) at the level of places, not individuals. To ensure privacy and help prevent de-anonymization and re-identification, we only consider places in which we detected at least 20 different users within the six-month period.

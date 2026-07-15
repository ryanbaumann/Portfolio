---
title: DevX Is a Growth Discipline
slug: devx-is-a-growth-discipline
aliases: ["/writing/devex-is-a-growth-discipline/"]
summary: DevX teams should own developer friction from discovery through distribution, product improvement, and measurable growth.
date: 2026-07-14
updated: 2026-07-15
canonical: https://www.ryanbaumann-portfolio.com/writing/devx-is-a-growth-discipline/
image: /assets/devx-growth-loop.svg
imageAlt: A continuous loop from finding developer friction to shipping a better experience, distributing it, and measuring the outcome.
socialImage: /social/devx-growth-discipline.png
shareTitle: DevX Is a Growth Discipline
shareSummary: Own the friction, ship the fix, distribute the experience, and measure the outcome.
shareImageAlt: The DevX growth loop: find friction, ship, distribute, and measure.
tags: ["developer experience", "growth", "distribution", "ai"]
order: 1
---

DevX is a growth discipline. The job is not to publish more documentation. The job is to find the friction that stops a builder, fix it in the product or experience, put that fix where people work, and prove that it improved an outcome.

That outcome might be more successful first runs, faster time to value, higher activation, or stronger retention. The metric depends on the product. The operating loop does not: find the constraint, ship a better path, distribute it, measure the result, and repeat.

## Own the friction

Developer friction shows up everywhere: failed first runs, abandoned evaluations, support tickets, GitHub issues, field conversations, and user research. DevX needs one view across those signals. More importantly, DevX needs to own what happens next.

Ownership means more than filing a product request. If onboarding is broken, fix onboarding. If the API shape creates repeat failures, improve the product. If the sample sends builders down the wrong path, replace it. Ship the new experience, then stay accountable for whether it worked.

AI expands both the audience and the feedback loop. Builders can now produce working software without understanding every layer underneath it. Some of those builders are people. Some are agents acting for people. DevX has to design for both.

## Distribution is key

A great experience has no impact if builders never encounter it. Documentation is one distribution surface, not the whole strategy. The path also needs to appear in the editor, agent, search result, sample, template, or tool where the work begins.

That changes the artifact. In the last platform era, DevX teams shipped SDKs and open-source libraries for the most-used languages and frameworks. In the AI era, we also need portable context: skills, tools, examples, and evaluations that help an agent produce the same high-quality path wherever a builder starts.

I have seen what that distribution can move. From March 2025 to March 2026, our Google Maps Platform open-source client libraries grew unique active users 300% and API engagement approximately 200%. We treated the libraries, AI integrations, and the paths into them as one [distribution system](/work/agentic-growth/).

Distribution cannot be an afterthought. Design the experience so it can travel, then make it the default in the workflows that already have reach.

## Measure and own outcomes

Traditional feedback loops are slow. Interviews, support themes, and developer surveys remain useful, but they can take weeks to turn into a clear product decision. Agent evaluations can shorten that loop. A simulated user or coding agent can attempt the journey continuously, expose the exact point of failure, and score whether a change improved the result.

Evals do not replace user research. They let a DevX team test a specific hypothesis before waiting for the next round of qualitative signal. Pair them with product telemetry and direct user evidence. Measure whether builders found the experience, completed the task, and returned.

![An agentic evaluation loop from task to agent run to score to a ship-or-hold decision.](/img/work/agentic-evals.svg)

This is the discipline: own the friction, solve it, improve the product, ship the better experience into the workflow, and measure the impact. Then run the loop again.

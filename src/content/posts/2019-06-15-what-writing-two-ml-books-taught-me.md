---
title: "what writing two ML books taught me about teaching ML"
date: 2019-06-15
slug: what-writing-two-ml-books-taught-me
excerpt: "Two books, twenty months of evenings, royalty income that did not pay for the coffee. The compounding returns were everywhere else."
tags: [machine-learning, books, writing, teaching, career]
---

I wrote two books on machine learning between 2017 and 2019. The royalty income from both, combined, was less than two months of my salary at the time. By the dollar metric, it was the worst hourly rate of any work I have ever done.

By every other metric, it was the most compounding work I have ever done. The royalty was almost beside the point.

Here is what twenty months of writing about ML actually taught me.

## the royalty math

Both books were published in the standard technical-publishing model. The advance was small. The royalty rate was around 8-12% of net publisher revenue. After international sales tax, agent cut (none in my case), and the discount-stack on most actual sales, the realised royalty was closer to 4-6% of cover price.

For 5,000 copies sold across both books over their lifetime, that worked out to roughly ₹3.5 lakh in total income. Spread over the two years of writing and the four years since, the effective hourly rate was below minimum wage.

If you write a technical book to make money, do not write a technical book. The economics do not work and have not worked since the mid-2000s.

## what writing forced

Writing a book forces the kind of clarity that thinking, blogging, and even teaching do not.

A blog post can hand-wave. A talk can rely on charisma. A book chapter cannot. The reader, sitting alone with the text, has no other source of explanation. If the chapter is unclear, the reader gives up and leaves a one-star review.

The discipline of writing chapter-after-chapter is the discipline of *making sure your understanding is actually complete*. Topics I thought I knew well — gradient descent, the bias-variance trade-off, regularisation — I rewrote three or four times because the first version showed I had been carrying a wrong intuition for years. The exercise of writing them down clearly was the exercise of finding the wrong intuitions and fixing them.

Without the book, those intuitions would have stayed wrong. The blog posts would have been good enough to publish. The talk audience would not have caught the error. The book reader caught all of them.

## the credential

The credential effect is real and is the part most authors do not anticipate.

In the year after the first book published, I was invited to roughly twenty talks, six conference panels, three corporate workshops, and dozens of recruiter conversations. None of those would have existed without the book. The book turned out to be a permanent search-ranking artifact — anyone Googling my name for the next decade would see "ML book author" as the first credential.

The hourly rate of those downstream invitations, conservatively, paid back the book's writing cost by 50x. The royalty income was a rounding error against the speaking, advisory, and hiring conversations the book unlocked.

The credential does not require the book to be commercially successful. It requires the book to exist. Once it exists, anyone who needs to evaluate the author's authority cites it. The book is a signal that the author was willing to do the unglamorous work of explaining something carefully.

## the teaching loop

The most underrated benefit of writing a technical book is the feedback loop with readers.

Errata accumulate. Email comes in: "the proof on page 142 has a typo," "the example in chapter 8 fails on the latest scikit-learn," "this section is unclear, here is what I think you meant." Some of those emails are wrong. Most of them are right.

Over the year since the second book published, I have received roughly 200 such emails. Each one is a piece of free quality control on my understanding. Each correction makes my next teaching better. The next time I explain regularisation in a workshop, I do it correctly because three different readers caught three different misstatements in chapter 6.

This is the teaching loop most teachers do not have. A teacher in a classroom gets immediate feedback but rarely deep, considered feedback. A book gets deep, considered feedback from strangers who have nothing to gain. That feedback is the closest thing to a peer review most technical authors will ever receive.

## the code that survives

The code from the books — published as open-source on GitHub — is more durable than the books themselves.

The text dates. Already several chapters of my first book are partially obsolete because the ML libraries they reference have moved. The text is still useful for the concepts but the code examples need updating.

The GitHub repos, by contrast, are maintained. Other readers send pull requests. The code adapts to library updates. The repos are referenced in course syllabi at universities I have never visited.

The lesson, in retrospect: I should have built the code-and-examples as the primary deliverable and the book as the secondary one. Most technical books would be more useful as a series of well-commented Jupyter notebooks with a long-form essay tying them together. The publishing industry does not let you do this. The closest hack is to publish both.

## the byproduct effect

The most surprising thing about the books, eighteen months later, is the byproducts. Conversations that turned into job offers. Friendships with other authors. Workshop invitations in cities I would not otherwise have visited. A small but devoted reader base that asks for sequels and discusses chapters on Twitter.

None of these were planned. None of them showed up in the royalty statement. All of them compounded.

The reason to write a technical book is not the book. It is the everything-else that the book attracts toward you over the following decade. The book is the signal. The signal selects for the kind of opportunities you would not otherwise have known existed.

If you are weighing whether to write a technical book, do not weigh it against the royalty. Weigh it against the next decade of byproducts. The byproducts are what justify the twenty months. Almost everything else does not.

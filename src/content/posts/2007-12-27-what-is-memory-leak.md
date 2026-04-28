---
title: "What is Memory Leak???"
date: 2007-12-27
slug: what-is-memory-leak
excerpt: "When memory is allocated using malloc() in any function ,it returns a pointer to the start of the data………and again we free the memory using free() wit the help of pointer.but it sh…"
tags: [programming, tech]
legacy: true
source: wordpress.com
original_url: https://intrepidkarthi.wordpress.com/2007/12/27/what-is-memory-leak/
---

When memory is allocated using malloc() in any function ,it returns a pointer to the start of the data………and again we free the memory using free() wit the help of pointer.but it should be used b4 we leave the function.n if it’s not used the pointer is lost and there is no way to clr the memory and it can never be used.  
tis is called MEMORY LEAK………

For example:

```c
#include<stdio.h>
#include<string.h>
int main()
{
char *ptr;
ptr = NULL;
ptr = strdup(“HI”);
printf(“\n%s”,ptr);
// free(ptr);
// ptr = NULL;
return 0;
}
```

It will show memory leak of 3 bytes.  
now Uncomment the commented lines, no memory leak will be there.

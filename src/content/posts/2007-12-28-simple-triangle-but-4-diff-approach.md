---
title: "Simple Triangle.. But 4 diff approach…."
date: 2007-12-28
slug: simple-triangle-but-4-diff-approach
excerpt: "A program to draw like this…. first: include<stdio.h int main() { int i, j, base = 10; clrscr(); for(i = 0; i < base / 2; i++) { for(j = 0; j < base / 2 – i; j++) printf(” “); prin…"
tags: [programming]
legacy: true
source: wordpress.com
original_url: https://intrepidkarthi.wordpress.com/2007/12/28/simple-triangle-but-4-diff-approach/
---

A program to draw like this….

*  
**  
***  
****  
*****  
******

**first:**

```c
#include<stdio.h>

int main()
{
int i, j, base = 10;

clrscr();

for(i = 0; i < base / 2; i++)
{
for(j = 0; j < base / 2 – i; j++)
printf(” “);
printf(“*”);
for(j = 0; j < i * 2 – 1; j++)
printf(” “);
if(i > 0)
printf(“*”);
printf(“\n”);
}

for(i = 0; i < base + 1; i++)
printf(“*”);

return 0;
}
```

**second:**

```c
#include<iostream.h>
#include<conio.h>
main()
{

int i,j,k;
for (i=0;i<6;i++)
{
for(j=0;j<i;j++)

cout<<“*”<<endl;

}
getch();
}
```

**third:**

```c
void main()
{
int i, j, k, n;
clrscr();
printf(“\n enter the value of n:”);
scanf(“%d”,&n);

for(i=1;i<=n;++i)
{
for(j=1;j<=n-i;++j)
{
printf(” “);
}
for(k=1;k<=i;++k)
{
printf(“* “);
}
printf(“\n”);
}
getch();
}
```

**four:**

```c
int comb(int n,int r)
{
int C;
C=fact(n)/(fact(r) * fact(n-r));
return C;
}
```

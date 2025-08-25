def solve():
    ptr = input()
    ans = ""
    for i in range(len(ptr)):
        temp = ""
        x = ptr[i]
        count =0
        j =i+1
        for j in range(len(ptr)):
            if ptr[j]==x:
                count+=1
        temp = x + str(count)
        ans += temp
        
    print(ans)

if __name__ == "__main__":
    solve()
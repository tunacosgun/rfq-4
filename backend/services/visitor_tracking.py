"""
Visitor Tracking Service
Tracks website visitors with IP, location, browser info
"""
import requests
from datetime import datetime, timezone
from typing import Optional


def get_location_from_ip(ip: str) -> dict:
    """Get location info from IP using ipapi.co (free tier)"""
    try:
        if ip in ['127.0.0.1', 'localhost', '::1']:
            return {
                'country': 'Local',
                'city': 'Development',
                'region': 'Local',
                'timezone': 'UTC'
            }
        
        response = requests.get(f'https://ipapi.co/{ip}/json/', timeout=3)
        if response.status_code == 200:
            data = response.json()
            return {
                'country': data.get('country_name', 'Unknown'),
                'city': data.get('city', 'Unknown'),
                'region': data.get('region', 'Unknown'),
                'timezone': data.get('timezone', 'UTC')
            }
    except Exception as e:
        print(f"Location lookup error: {e}")
    
    return {
        'country': 'Unknown',
        'city': 'Unknown',
        'region': 'Unknown',
        'timezone': 'UTC'
    }


def parse_user_agent(user_agent: str) -> dict:
    """Parse browser and OS from user agent string"""
    ua = user_agent.lower()
    
    # Browser detection
    browser = 'Unknown'
    if 'edg' in ua:
        browser = 'Edge'
    elif 'chrome' in ua and 'safari' in ua:
        browser = 'Chrome'
    elif 'firefox' in ua:
        browser = 'Firefox'
    elif 'safari' in ua and 'chrome' not in ua:
        browser = 'Safari'
    elif 'opera' in ua or 'opr' in ua:
        browser = 'Opera'
    
    # OS detection
    os = 'Unknown'
    if 'windows' in ua:
        os = 'Windows'
    elif 'mac' in ua:
        os = 'MacOS'
    elif 'linux' in ua:
        os = 'Linux'
    elif 'android' in ua:
        os = 'Android'
    elif 'iphone' in ua or 'ipad' in ua:
        os = 'iOS'
    
    # Device type
    device = 'Desktop'
    if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
        device = 'Mobile'
    elif 'tablet' in ua or 'ipad' in ua:
        device = 'Tablet'
    
    return {
        'browser': browser,
        'os': os,
        'device': device,
        'user_agent': user_agent[:200]  # Truncate long UAs
    }


async def track_visitor(db, ip: str, user_agent: str, page: str):
    """Track a visitor to the database"""
    try:
        location = get_location_from_ip(ip)
        browser_info = parse_user_agent(user_agent)
        
        visitor_data = {
            'ip': ip,
            'page': page,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'country': location['country'],
            'city': location['city'],
            'region': location['region'],
            'timezone': location['timezone'],
            'browser': browser_info['browser'],
            'os': browser_info['os'],
            'device': browser_info['device'],
            'user_agent': browser_info['user_agent']
        }
        
        await db.visitors.insert_one(visitor_data)
        return True
    except Exception as e:
        print(f"Visitor tracking error: {e}")
        return False
